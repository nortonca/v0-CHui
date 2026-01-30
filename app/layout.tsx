import type React from "react"
import "./globals.css"
import { ModalProvider } from "@/components/providers/modal-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 overflow-hidden">
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
