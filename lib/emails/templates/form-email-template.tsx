import { Button, Section, Text } from "react-email"
import { EmailLayout } from "../email-layout"

export interface FormEmailProps {
  name: string
  email: string
  message: string
  subject?: string
}

export function FormEmail({ name, email, message, subject }: FormEmailProps) {
  return (
    <EmailLayout
      preview={`New form submission from ${name}`}
      eyebrow="Contact Form"
      heading="New Inquiry Received"
    >
      <Section className="bg-steel-50 border border-solid border-steel-100 rounded-md p-4 mb-5">
        <Text className="text-steel-900 text-sm m-0 mb-2">
          <span className="text-steel font-semibold">Name:</span> {name}
        </Text>
        <Text className="text-steel-900 text-sm m-0 mb-2">
          <span className="text-steel font-semibold">Email:</span> {email}
        </Text>
        {subject && (
          <Text className="text-steel-900 text-sm m-0">
            <span className="text-steel font-semibold">Subject:</span> {subject}
          </Text>
        )}
      </Section>

      <Text className="text-steel text-xs font-semibold uppercase tracking-wider mt-0 mb-2">
        Message
      </Text>
      <Text className="text-steel-900 text-sm leading-6 whitespace-pre-wrap mt-0 mb-6">
        {message}
      </Text>

      <Button
        href={`mailto:${email}`}
        className="bg-knicks text-white text-sm font-semibold rounded-md px-5 py-3 no-underline inline-block"
      >
        Reply to {name}
      </Button>
    </EmailLayout>
  )
}

FormEmail.PreviewProps = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Project inquiry",
  message: "Hi team, I'd love to learn more about your services.",
} satisfies FormEmailProps

export default FormEmail