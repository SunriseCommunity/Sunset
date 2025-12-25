"use client";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AudioProvider } from "@/lib/providers/AudioProvider";
import { RestrictionProvider } from "@/lib/providers/RestrictionProvider";
import { SelfProvider } from "@/lib/providers/SelfProvider";
import fetcher from "@/lib/services/fetcher";

export default function Providers({ children, locale, messages }: { children: ReactNode; locale: string; messages: Record<string, string> }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 1000 * 30,
        dedupingInterval: 1000 * 10,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SelfProvider>
          <RestrictionProvider>
            <AudioProvider>
              <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
                {children}
                <Toaster />
              </NextIntlClientProvider>
            </AudioProvider>
          </RestrictionProvider>
        </SelfProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
