"use client";
import {
  Github,
  ServerCrash,
  VoteIcon,
} from "lucide-react";
import Link from "next/link";

import { useVersion } from "@/lib/hooks/api/useVersion";
import { useT } from "@/lib/i18n/utils";

export default function Footer() {
  const t = useT("components.footer");

  const version = useVersion();

  const solarSystemVersion = version.data?.solar_system_version;

  return (
    <footer className="space-y-6 border-t-2 bg-background/50 p-4 text-center text-sm text-current">
      {process.env.NEXT_PUBLIC_OSU_SERVER_LIST_LINK && (
        <a
          href={process.env.NEXT_PUBLIC_OSU_SERVER_LIST_LINK}
          className="smooth-transition flex cursor-pointer items-center justify-center space-x-1  font-bold hover:scale-105 "
        >
          <VoteIcon className="mr-1" />
          <p className="animate-gradient bg-gradient-to-r from-stone-400 via-orange-300 to-amber-600 bg-size-300 bg-clip-text text-transparent ">
            {t("voteMessage")}
          </p>
        </a>
      )}

      <div className="grid justify-center space-x-4 md:flex">
        <p>{t("copyright")}</p>
        <p>•</p>
        <a
          href="https://github.com/SunriseCommunity"
          className="smooth-transition flex cursor-pointer items-center justify-center space-x-1 hover:text-primary"
        >
          <Github className="mr-1" />
          {t("sourceCode")}
        </a>
        {process.env.NEXT_PUBLIC_STATUS_PAGE_LINK && (
          <>
            <p>•</p>
            <a
              href={process.env.NEXT_PUBLIC_STATUS_PAGE_LINK}
              className="smooth-transition flex cursor-pointer items-center justify-center space-x-1 hover:text-primary"
            >
              <ServerCrash className="mr-1" />
              {t("serverStatus")}
            </a>
          </>
        )}
      </div>
      <p>{t("disclaimer")}</p>
      {solarSystemVersion && (
        <div>
          <Link
            href={`${process.env.NEXT_PUBLIC_SOLAR_SYSTEM_LINK ?? `https://github.com/SunriseCommunity/Solar-System`
             }/releases/tag/${solarSystemVersion}`}
            className="text-xs italic text-muted-foreground"
          >
            {t("solarSystemVersion", { solarSystemVersion })}
          </Link>
        </div>
      )}
    </footer>
  );
}
