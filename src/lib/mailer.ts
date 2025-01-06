import nodemailer from 'nodemailer'
import { env } from '@/env'
import { welcomeEmailTemplate } from '@/utils/welcome-email-template'

interface UserProps {
  name: string
  email: string
}

export async function sendWelcomeMail(user: UserProps) {
  const htmlContent = welcomeEmailTemplate(user.name)

  const transporter = nodemailer.createTransport({
    host: env.NODEMAILER_HOST,
    port: 587,
    secure: false,
    auth: {
      user: env.NODEMAILER_USER,
      pass: env.NODEMAILER_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `Authentication API <${env.NODEMAILER_USER}>`,
    to: user.email,
    subject: 'Bem-vindo(a) ao app!',
    html: htmlContent,
  })
}
