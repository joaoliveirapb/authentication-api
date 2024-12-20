import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { createUserRoute } from './routes/create-user'
import { authenticateRoute } from './routes/authenticate'
import { protectedRoute } from './routes/protected'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: '15m' },
})

app.register(createUserRoute)
app.register(authenticateRoute)
app.register(protectedRoute)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
