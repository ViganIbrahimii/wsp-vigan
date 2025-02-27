import { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getBrand } from "@/api/brand"
import { getProfile } from "@/api/profile"
import { Locale, locales } from "@/i18n.config"
import { routing } from "@/i18n/routing"
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider"
import { FullscreenProvider } from "@/providers/FullscreenProvider"
import TanstackQueryProvider from "@/providers/TanstackQueryProvider"
import { WebSocketProvider } from "@/providers/WebSocketProvider"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/Sidebar/Sidebar"
import { ThemeProvider } from "@/components/theme-provider"

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: Locale }
}

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@_rdev7",
  },
  icons: {
    icon: "/favicon.ico",
  },
}
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}
export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const authToken = cookies().get("authToken")?.value || null
  const brandId = cookies().get("brandId")?.value || null
  const userId = cookies().get("userId")?.value || null

  const messages = await getMessages()

  let user = null
  let brand = null

  if (authToken && userId) {
    const [profileResponse, brandResponse] = await Promise.all([
      getProfile({ user_id: userId }, { Authorization: `Bearer ${authToken}` }),
      brandId
        ? getBrand(
            { brand_id: brandId },
            { Authorization: `Bearer ${authToken}` }
          )
        : Promise.resolve(null),
    ])

    user = profileResponse?.data?.data || null
    brand = brandResponse?.data?.data || null
  }

  return (
    <html suppressHydrationWarning lang={locale} className="w-full">
      <body
        className={cn(
          "flex min-h-screen w-full flex-col flex-wrap bg-cover bg-no-repeat antialiased",
          dmSans.className
        )}
      >
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryProvider>
            <AuthProvider
              authToken={authToken}
              userId={userId}
              brandId={brandId}
              user={user}
              brand={brand}
            >
              <WebSocketProvider>
                <FullscreenProvider>
                  <NextIntlClientProvider messages={messages}>
                    <Sidebar>{children}</Sidebar>
                  </NextIntlClientProvider>
                </FullscreenProvider>
              </WebSocketProvider>
            </AuthProvider>
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
