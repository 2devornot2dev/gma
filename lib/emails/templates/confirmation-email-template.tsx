import { Button, Section, Text } from "react-email"
import { EmailLayout } from "../email-layout"

export interface ConfirmationDetail {
  label: string
  value: string
}

export interface ConfirmationEmailProps {
  heading: string
  body: string
  name?: string
  eyebrow?: string
  preview?: string
  details?: ConfirmationDetail[]
  cta?: {
    label: string
    href: string
  }
  footnote?: string
}

export function ConfirmationEmail({
  heading,
  body,
  name,
  eyebrow = "Confirmation",
  preview,
  details,
  cta,
  footnote,
}: ConfirmationEmailProps) {
  return (
    <EmailLayout
      preview={preview ?? heading}
      eyebrow={eyebrow}
      heading={heading}
    >
      <Text className="text-steel-900 text-sm leading-6 mt-0 mb-4">
        {name ? `Hi ${name},` : "Hi there,"}
      </Text>

      <Text className="text-steel-900 text-sm leading-6 whitespace-pre-wrap mt-0 mb-5">
        {body}
      </Text>

      {details && details.length > 0 && (
        <Section className="bg-steel-50 border border-solid border-steel-100 rounded-md p-4 mb-6">
          {details.map((item, i) => (
            <Text
              key={`${item.label}-${i}`}
              className={
                i < details.length - 1
                  ? "text-steel-900 text-sm leading-6 m-0 mb-2"
                  : "text-steel-900 text-sm leading-6 m-0"
              }
            >
              <span className="text-steel font-semibold">{item.label}:</span>{" "}
              <span className="whitespace-pre-wrap">{item.value}</span>
            </Text>
          ))}
        </Section>
      )}

      {cta && (
        <Section className={footnote ? "mb-5" : "mb-0"}>
          <Button
            href={cta.href}
            className="bg-navy text-white text-sm font-semibold rounded-md px-5 py-3 no-underline inline-block"
          >
            {cta.label}
          </Button>
        </Section>
      )}

      {footnote && (
        <Text className="text-steel text-xs leading-5 m-0">{footnote}</Text>
      )}
    </EmailLayout>
  )
}

ConfirmationEmail.PreviewProps = {
  eyebrow: "Confirmation",
  heading: "We Received Your Request",
  name: "Jane Doe",
  body: "Thanks for reaching out. We've logged your request and a member of our team will follow up shortly.",
  details: [
    { label: "Reference", value: "#GMA-1042" },
    { label: "Topic", value: "Project inquiry" },
  ],
  cta: {
    label: "Visit Website",
    href: "https://example.com",
  },
  footnote: "Need to update something? Just reply directly to this email.",
} satisfies ConfirmationEmailProps

export default ConfirmationEmail