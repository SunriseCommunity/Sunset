"use client";

import {
  HeartHandshake,
  LucideMessageCircleQuestion,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function SupportUs() {
  const t = useT("pages.support");

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<HeartHandshake />}
        roundBottom={true}
      />

      <div>
        <PrettyHeader
          text={t("section.title")}
          icon={<LucideMessageCircleQuestion />}
        />
        <RoundedContent>
          <div className="mx-auto flex w-11/12 flex-col">
            <div className="flex flex-col lg:flex-row">
              <div className="space-y-4">
                <h2 className="text-sm">{t.rich("section.intro")}</h2>

                <ol className="list-inside list-decimal space-y-4">
                  {(process.env.NEXT_PUBLIC_KOFI_LINK
                    || process.env.NEXT_PUBLIC_BOOSTY_LINK) && (
                    <div>
                      <li>
                        {t.rich("section.donate.title")}
                        <p className="text-sm">
                          {t("section.donate.description")}
                        </p>
                      </li>
                      <div className="my-2 space-x-4">
                        {process.env.NEXT_PUBLIC_KOFI_LINK && (
                          <Button size="lg" asChild>
                            <Link href={process.env.NEXT_PUBLIC_KOFI_LINK}>
                              {t("section.donate.buttons.kofi")}
                            </Link>
                          </Button>
                        )}
                        {process.env.NEXT_PUBLIC_BOOSTY_LINK && (
                          <Button size="lg" asChild>
                            <Link href={process.env.NEXT_PUBLIC_BOOSTY_LINK}>
                              {t("section.donate.buttons.boosty")}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <li>
                    {t.rich("section.spreadTheWord.title")}
                    <p className="text-sm">
                      {t("section.spreadTheWord.description")}
                    </p>
                  </li>
                  <li>
                    {t.rich("section.justPlay.title")}
                    <p className="text-sm">
                      {t("section.justPlay.description")}
                    </p>
                  </li>
                </ol>
              </div>
              <Image
                src="/images/supportus.png"
                alt="frontpage image"
                width={1150}
                height={1150}
                className="size-full rounded-lg md:min-h-96 md:min-w-96"
              />
            </div>
          </div>
        </RoundedContent>
      </div>
    </div>
  );
}
