import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  NODEMAILER_HOST: z.string(),
  NODEMAILER_USER: z.string().email(),
  NODEMAILER_PASSWORD: z.string(),
})

export const env = envSchema.parse(process.env)
