import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.headers.authorization?.replace(/^Bearer\s/, '')

  if (!token) {
    return reply.status(401).send({ message: 'Token is missing' })
  }

  try {
    await request.jwtVerify()
  } catch (error) {
    return reply.status(401).send({ message: 'Token invalid' })
  }
}
