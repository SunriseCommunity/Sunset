"use client";

import { BookCopy, LucideMessageCircleQuestion } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useT } from "@/lib/i18n/utils";
import { tryParseNumber } from "@/lib/utils/type.util";

export default function Wiki() {
  const pathname = usePathname();
  const t = useT("pages.wiki.articles");
  const tHeader = useT("pages.wiki");

  const [value, setValue] = useState<string | null>(null);

  const wikiContent = useMemo(
    () => [
      {
        tag: "How to connect",
        title: t("howToConnect.title"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <h1 className="text-xl">{t("howToConnect.intro")}</h1>
              <ol className="mt-2 list-inside list-decimal">
                <li>{t.rich("howToConnect.step1")}</li>
                <li>{t("howToConnect.step2")}</li>
                <li>{t("howToConnect.step3")}</li>
                <li>
                  {t.rich("howToConnect.step4", {
                    serverDomain: process.env.NEXT_PUBLIC_SERVER_DOMAIN || "",
                  })}
                </li>
                <li>{t("howToConnect.step5")}</li>
                <li>{t("howToConnect.step6")}</li>
              </ol>
              <Image
                src="/images/wiki/osu-connect.png"
                alt={t("howToConnect.imageAlt")}
                width={800}
                height={200}
                className="mt-4 rounded-lg"
              />
            </div>
          </RoundedContent>
        ),
      },
      {
        tag: "Can I have multiple accounts?",
        title: t("multipleAccounts.title"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <h1 className="text-xl">{t("multipleAccounts.answer")}</h1>
              <p className="mt-2">{t("multipleAccounts.consequence")}</p>
            </div>
          </RoundedContent>
        ),
      },
      {
        tag: "Can I use cheats or hacks?",
        title: t("cheatsHacks.title"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <h1 className="text-xl">{t("cheatsHacks.answer")}</h1>
              <p className="mt-2">{t.rich("cheatsHacks.policy")}</p>
            </div>
          </RoundedContent>
        ),
      },
      {
        tag: "I think I was restricted unfairly. How can I appeal?",
        title: t("appealRestriction.title"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <p>
                {t("appealRestriction.instructions")}
                {process.env.NEXT_PUBLIC_DISCORD_LINK && (
                  <span>
                    {" "}
                    {t.rich("appealRestriction.contactStaff", {
                      a: chunks => (
                        <Link
                          href={process.env.NEXT_PUBLIC_DISCORD_LINK ?? ""}
                          className="text-primary underline transition-opacity hover:opacity-80"
                        >
                          {chunks}
                        </Link>
                      ),
                    })}
                  </span>
                )}
              </p>
              <div />
            </div>
          </RoundedContent>
        ),
      },
      {
        tag: "Can I contribute/suggest changes to the server?",
        title: t("contributeSuggest.title"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <h1 className="text-xl">{t("contributeSuggest.answer")}</h1>
              <p className="mt-2">
                {t.rich("contributeSuggest.instructions", {
                  a: chunks => (
                    <Link
                      href="https://github.com/SunriseCommunity"
                      className="text-primary underline transition-opacity hover:opacity-80"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </RoundedContent>
        ),
      },
      {
        tag: "I can’t download maps when I’m in multiplayer, but I can download them from the main menu",
        title: t("multiplayerDownload.title"),
        content: (
          <RoundedContent>
            <div className="mx-auto flex w-11/12 flex-col">
              <h1 className="text-xl">
                {t.rich("multiplayerDownload.solution")}
              </h1>
            </div>
          </RoundedContent>
        ),
      },
    ],
    [t],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = decodeURIComponent(window.location.hash).slice(1);
      const element = wikiContent.find(({ tag }) => tag === hash);

      if (element) {
        const index = wikiContent.indexOf(element).toString();
        setValue(index);

        const target = document.getElementById(`accordion-item-${index}`);
        target?.scrollIntoView({ behavior: "smooth" });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- causes unwanted resets of the accordion
  }, [pathname]);

  useEffect(() => {
    const element = wikiContent[tryParseNumber(value) ?? -1];

    window.history.replaceState(
      null,
      "",
      pathname + (element ? `#${encodeURIComponent(element.tag)}` : ""),
    );
  }, [value, pathname, wikiContent]);

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={tHeader("header")}
        icon={<BookCopy />}
        roundBottom={true}
      />

      <Accordion
        type="single"
        collapsible
        className="space-y-4"
        value={value ?? undefined}
        onValueChange={setValue}
      >
        {wikiContent.map(({ title, content }, index) => (
          <AccordionItem
            id={`accordion-item-${index}`}
            // eslint-disable-next-line @eslint-react/no-array-index-key -- static list
            key={`wiki-accordion-item-${index}`}
            value={index.toString()}
            className="border-b-0"
          >
            <AccordionTrigger className="flex rounded-t-lg bg-card p-4 shadow [&[data-state=closed]]:rounded-lg">
              <div className="flex items-center space-x-2">
                <LucideMessageCircleQuestion className="flex-shrink-0" />
                <p>{title}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
