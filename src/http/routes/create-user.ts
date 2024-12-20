import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string().min(1, 'Name is required'),
          email: z.string().email({ message: 'Invalid email format' }),
          password: z
            .string()
            .min(6, 'Password must be at least 6 characters long'),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        return reply.status(409).send({ message: 'User already exists' })
      }

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: { name, email, password: passwordHash },
      })

      return reply.status(201).send()
    }
  )
}
