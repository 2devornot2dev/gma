import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email"
import type { ReactNode } from "react"
import { EMAIL_CONFIG, emailTailwindConfig } from "./email-config"

interface EmailLayoutProps {
  preview: string
  eyebrow?: string
  heading?: string
  children: ReactNode
}

export function EmailLayout({
  preview,
  eyebrow,
  heading,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Preview>{preview}</Preview>
        <Body className="bg-steel-50 font-sans text-steel-900 m-0 py-10 px-4">
          <Container className="bg-background border border-solid border-steel-100 rounded-lg overflow-hidden mx-auto max-w-[560px]">
            <Section className="bg-navy border-b-4 border-solid border-knicks px-8 py-6">
              <Text className="font-heading text-white text-lg font-bold tracking-wider uppercase m-0">
                {EMAIL_CONFIG.brandName}
              </Text>
              {eyebrow && (
                <Text className="text-knicks text-xs font-semibold tracking-wider uppercase mt-3 mb-0">
                  {eyebrow}
                </Text>
              )}
              {heading && (
                <Heading className="font-heading text-white text-xl font-bold mt-1 mb-0">
                  {heading}
                </Heading>
              )}
            </Section>

            <Section className="px-8 py-7">{children}</Section>

            <Section className="px-8 pb-7">
              <Hr className="border-steel-100 mt-0 mb-5" />
              <Text className="text-steel text-xs leading-5 m-0">
                Sent by {EMAIL_CONFIG.brandName} ·{" "}
                <Link
                  href={EMAIL_CONFIG.baseUrl}
                  className="text-navy font-medium underline"
                >
                  {EMAIL_CONFIG.baseUrl.replace(/^https?:\/\//, "")}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}