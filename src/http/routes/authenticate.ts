import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import dayjs from 'dayjs'

export const authenticateRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/sessions',
    {
      schema: {
        body: z.object({
          email: z
            .string()
            .email({ message: 'Invalid email format' })
            .min(1, 'Email is required'),
          password: z.string().min(1, 'Password is required'),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.status(401).send({ message: 'Invalid credentials' })
      }

      const doesPasswordMatches = await compare(password, user.password)

      if (!doesPasswordMatches) {
        return reply.status(401).send({ message: 'Invalid credentials' })
      }

      const token = app.jwt.sign({
        user: { id: user.id, name: user.name, email: user.email },
      })

      const refreshTokenEntry = await prisma.refreshToken.upsert({
        where: { user_id: user.id },
        update: {
          user_id: user.id,
          expires_at: dayjs().add(7, 'days').toDate(),
        },
        create: {
          user_id: user.id,
          expires_at: dayjs().add(7, 'days').toDate(),
        },
      })

      const refreshToken = app.jwt.sign(
        { id: refreshTokenEntry.id },
        { expiresIn: '7d' },
      )

      return reply.status(200).send({ token, refreshToken })
    }
  )
}
