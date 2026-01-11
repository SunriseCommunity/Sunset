import "./globals.css";
import "./style.css";

import type { Metadata } from "next";
import { Noto_Sans, Poppins } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";

import Providers from "@/components/Providers";
import ScrollUp from "@/components/ScrollUp";
import ScrollUpButton from "@/components/ScrollUpButton";
import { getT } from "@/lib/i18n/utils";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "devanagari", "latin-ext"],
  fallback: ["Noto Sans"],
});

const _fallbackFont = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("components.rootLayout.meta");
  return {
    title: t("title"),
    twitter: {
      card: "summary",
    },
    description: t("description"),
    openGraph: {
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html
      lang={locale}
      className={`${font.className}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-medium text-current">
        <Providers locale={locale} messages={messages}>
          {children}
          <ScrollUp />
        </Providers>
        <ScrollUpButton />
      </body>
    </html>
  );
}
