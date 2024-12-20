import { ensureAuthenticated } from '@/middlewares/ensure-authenticated'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const protectedRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/protected',
    {
      onRequest: [ensureAuthenticated],
    },
    async (request, reply) => {
      return reply.status(200).send({ message: 'Acesso concedido' })
    }
  )
}
