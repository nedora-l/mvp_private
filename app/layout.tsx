import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { locales } from "@/middleware"
import ClientProviders from "@/components/ClientProviders"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "D&A Workspace",
  description: "A modern, responsive company Workspace platform",
  generator: 'D&A Workspace'
}

export async function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
