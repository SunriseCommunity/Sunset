"use client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AudioProvider } from "@/lib/providers/AudioProvider";
import { RestrictionProvider } from "@/lib/providers/RestrictionProvider";
import { SelfProvider } from "@/lib/providers/SelfProvider";
import fetcher from "@/lib/services/fetcher";
import { ReactNode } from "react";
import { SWRConfig } from "swr";

export default function Providers({ children }: { children: ReactNode }) {
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
              {children}
              <Toaster />
            </AudioProvider>
          </RestrictionProvider>
        </SelfProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
