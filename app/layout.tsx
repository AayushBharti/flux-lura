import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Flux Lura - Free Unlimited File Converter",
  description: `Unleash your creativity with Flux Lura – the ultimate online tool for
unlimited and free multimedia conversion. Transform images, audio, and
videos effortlessly, without restrictions. Start converting now and
elevate your content like never before!`,
  creator: "SOUHAIL BEN-LHACHEMI",
  keywords:
    "image converter, video converter, audio converter, unlimited image converter, unlimited video converter",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
