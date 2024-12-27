import { prisma } from '@/lib/prisma'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import dayjs from 'dayjs'

export const refreshTokenRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/refresh-token',
    {
      schema: {
        body: z.object({
          refreshToken: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { refreshToken } = request.body

      if (!refreshToken) {
        return reply.status(401).send({ message: 'Refresh token is missing' })
      }

      try {
        const { id } = app.jwt.verify(refreshToken) as { id: string }

        const tokenEntry = await prisma.refreshToken.findUnique({
          where: { id },
        })

        const isTokenExpired = dayjs().isAfter(dayjs(tokenEntry?.expires_at))

        if (!tokenEntry || isTokenExpired) {
          return reply.status(401).send({
            message: 'Invalid or expired refresh token',
          })
        }

        const token = app.jwt.sign({
          user: { userId: tokenEntry.user_id },
        })

        return reply.status(200).send({ token })
      } catch (error) {
        return reply.status(401).send({ message: 'Invalid refresh token' })
      }
    }
  )
}
