"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AVAILABLE_LOCALES, DISPLAY_NAMES_LOCALES } from "@/lib/i18n/messages";
import { getCountryCodeForLocale } from "@/lib/i18n/utils";

export function LanguageSelector() {
  const router = useRouter();
  const currentLocale = useLocale();

  const changeLanguage = useCallback(
    (locale: string) => {
      Cookies.set("locale", locale);
      router.refresh();
    },
    [router]
  );

  const getLanguageName = useCallback(
    (locale: string, displayLocale: string = currentLocale) => {
      try {
        const displayNames = new Intl.DisplayNames([displayLocale], {
          type: "language",
        });

        const name =
          DISPLAY_NAMES_LOCALES[locale] ||
          displayNames.of(locale) ||
          locale.toUpperCase();
        return name;
      } catch {
        return DISPLAY_NAMES_LOCALES[locale] || locale.toUpperCase();
      }
    },
    [currentLocale]
  );

  const languages = useMemo(() => {
    return AVAILABLE_LOCALES.map((localeCode) => ({
      code: localeCode,
      countryCode: getCountryCodeForLocale(localeCode),
      nativeName: getLanguageName(localeCode, localeCode),
    }));
  }, [getLanguageName]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-neutral-600 hover:bg-opacity-25 p-1 h-7 w-7 rounded-md cursor-pointer smooth-transition opacity-40 group-hover:opacity-100 md:h-8 md:w-8"
          aria-label="Select language"
        >
          <Languages className="h-[1.2rem] w-[1.2rem] md:h-5 md:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[200px] w-[calc(100vw-2rem)] max-w-[280px] md:min-w-[200px] md:w-auto"
        sideOffset={8}
      >
        {languages
          .sort((a, b) => a.nativeName.localeCompare(b.nativeName))
          .map((locale) => {
            const isActive = locale.code === currentLocale;

            return (
              <DropdownMenuItem
                key={locale.code}
                onClick={() => changeLanguage(locale.code)}
                className={cn(
                  "flex items-center gap-3 cursor-pointer py-2.5 px-3",
                  isActive && "bg-accent"
                )}
              >
                <Image
                  src={`/images/flags/${locale.countryCode}.png`}
                  alt={`${locale.nativeName} flag`}
                  width={24}
                  height={24}
                  className="md:w-6 md:h-6 w-5 h-5 flex-shrink-0"
                />
                <span className="flex-1 font-medium capitalize">
                  {locale.nativeName}
                </span>
                {isActive && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
