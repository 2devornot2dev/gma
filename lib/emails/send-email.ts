import type { ReactElement } from "react"
import { Resend } from "resend"
import { EMAIL_CONFIG } from "./email-config"

export const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailOptions {
  to: string | string[]
  subject: string
  react: ReactElement
  from?: string
  replyTo?: string | string[]
}

export async function sendEmail({
  to,
  subject,
  react,
  from = EMAIL_CONFIG.from,
  replyTo = EMAIL_CONFIG.replyTo,
}: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    replyTo,
    react,
  })

  if (error) {
    console.error("[sendEmail] Failed to send email:", error)
    throw new Error(error.message)
  }

  return data
}