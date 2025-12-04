import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ScrollUpButton from "@/components/ScrollUpButton";
import Providers from "@/components/Providers";
import ScrollUp from "@/components/ScrollUp";
import { getLocale, getMessages } from "next-intl/server";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "osu!sunrise",
  twitter: {
    card: "summary",
  },
  description: "osu!sunrise is a private server for osu!, a rhythm game.",
  openGraph: {
    siteName: "osu!sunrise",
    title: "osu!sunrise",
    description: "osu!sunrise is a private server for osu!, a rhythm game.",

    images: [
      {
        url: `https://${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/images/metadata.png`,
        width: 800,
        height: 800,
        alt: "osu!sunrise Logo",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html lang="en" className={font.className} suppressHydrationWarning>
      <body className="bg-background text-current min-h-screen flex flex-col font-medium">
        <Providers locale={locale} messages={messages}>
          {children}
          <ScrollUp />
        </Providers>
        <ScrollUpButton />
      </body>
    </html>
  );
}
