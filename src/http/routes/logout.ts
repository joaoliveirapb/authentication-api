import { prisma } from '@/lib/prisma'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const logoutRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/logout',
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
        return reply.status(400).send({ message: 'Refresh token is missing' })
      }

      try {
        const { id } = app.jwt.verify(refreshToken) as { id: string }

        await prisma.refreshToken.delete({
          where: { id },
        })

        return reply.status(200).send({ message: 'Logged out successfully' })
      } catch (error) {
        return reply.status(401).send({ message: 'Invalid refresh token' })
      }
    }
  )
}
