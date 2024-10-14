import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import localFont from "next/font/local"
import "./globals.css"
import { Toaster } from "../components/ui/toaster"

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
  title: "Flux Lura - Your Unlimited Free File Converter",
  description:
    "Unlock your creative potential with Flux Lura, the premier online tool for seamless multimedia conversion. Effortlessly transform images, audio, and videos without any limitations. Experience the freedom of unlimited conversions and elevate your content like never before. Start your journey with Flux Lura today!",
  creator: "Aayush Bharti",
  keywords:
    "image converter, video converter, audio converter, unlimited image converter, unlimited video converter, unlimited file conversion, multimedia transformation",
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
          <Toaster />
          <div className="max-w-4xl min-h-screen pt-28 lg:pt-32 2xl:pt-40 lg:max-w-6xl 2xl:max-w-7xl mx-auto">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
