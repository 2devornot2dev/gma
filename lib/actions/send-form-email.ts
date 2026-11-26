"use server"

import { createElement } from "react"
import { EMAIL_CONFIG } from "@/lib/emails/email-config"
import { sendEmail } from "@/lib/emails/send-email"
import { ConfirmationEmail } from "@/lib/emails/templates/confirmation-email-template"
import { FormEmail, type FormEmailProps } from "@/lib/emails/templates/form-email-template"

export async function sendContactAction(data: FormEmailProps) {
  try {
    await Promise.all([
      // 1. Sent to us
      sendEmail({
        to: EMAIL_CONFIG.adminEmail,
        replyTo: data.email,
        subject: data.subject
          ? `Form: ${data.subject}`
          : `New form submission from ${data.name}`,
        react: createElement(FormEmail, data),
      }),

      // 2. Sent to them (universal confirmation)
      sendEmail({
        to: data.email,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: `We received your message — ${EMAIL_CONFIG.brandName}`,
        react: createElement(ConfirmationEmail, {
          eyebrow: "Contact Form",
          heading: "We Received Your Message",
          name: data.name,
          body: `Thanks for contacting ${EMAIL_CONFIG.brandName}. Our team will review your message and get back to you shortly.`,
          details: [
            ...(data.subject ? [{ label: "Subject", value: data.subject }] : []),
            { label: "Message", value: data.message },
          ],
          cta: {
            label: `Visit ${EMAIL_CONFIG.brandName}`,
            href: EMAIL_CONFIG.baseUrl,
          },
        }),
      }),
    ])

    return { success: true as const }
  } catch (error) {
    console.error("[sendContactAction]", error)
    return {
      success: false as const,
      error: "Failed to send message. Please try again.",
    }
  }
}