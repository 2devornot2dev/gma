import { pixelBasedPreset, type Tailwind } from "react-email"
import type { ComponentProps } from "react"

export const EMAIL_CONFIG = {
  brandName: "GMA",
  from: process.env.EMAIL_FROM ?? "GMA <onboarding@resend.dev>",
  replyTo: process.env.EMAIL_REPLY_TO ?? "support@example.com",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@example.com",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://example.com",
  colors: {
    steel: {
      DEFAULT: "#53565a",
      50: "#f4f5f6",
      100: "#e6e7e9",
      300: "#a7a9ac",
      700: "#3a3d41",
      900: "#1e2023",
    },
    navy: {
      DEFAULT: "#0c2340",
      700: "#132e52",
      950: "#071628",
    },
    knicks: {
      DEFAULT: "#f58426",
      600: "#de6f12",
    },
    // Hex equivalents of your :root tokens for email client compatibility
    primary: "#53565a",
    secondary: "#0c2340",
    accent: "#f58426",
    background: "#ffffff",
    foreground: "#252525",
    muted: "#f7f7f7",
    "muted-foreground": "#737373",
    border: "#ebebeb",
  },
} as const

export const emailTailwindConfig: ComponentProps<typeof Tailwind>["config"] = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: EMAIL_CONFIG.colors,
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        heading: [
          "Archivo",
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
}