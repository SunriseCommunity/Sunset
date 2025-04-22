"use client";

import { BookCopy, LucideMessageCircleQuestion } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tryParseNumber } from "@/lib/utils/type.util";

const wikiContent = [
  {
    title: "How to connect",
    content: (
      <RoundedContent>
        <div className="flex flex-col w-11/12 mx-auto">
          <h1 className="text-xl">
            To connect to the server, you need to have a copy of the game
            installed on your computer. You can download the game from the
            official osu! website.
          </h1>
          <ol className="list-decimal list-inside mt-2">
            <li>
              Locale the <code className="text-primary/80">osu!.exe</code> file
              on in game directory.
            </li>
            <li>Create a shortcut of the file.</li>
            <li>Right click on the shortcut and select properties.</li>
            <li>
              In the target field, add{" "}
              <code className="text-primary/80">
                -devserver osu-sunrise.top
              </code>{" "}
              at the end of the path.
            </li>
            <li>Click apply and then OK.</li>
            <li>Double click on the shortcut to start the game.</li>
          </ol>
          <Image
            src="/images/wiki/osu-connect.png"
            alt="osu connect image"
            width={800}
            height={200}
            className="rounded-lg mt-4"
          />
        </div>
      </RoundedContent>
    ),
  },
  {
    title: "Can I have multiple accounts?",
    content: (
      <RoundedContent>
        <div className="flex flex-col w-11/12 mx-auto">
          <h1 className="text-xl">
            No. You are only allowed to have one account per person.
          </h1>
          <p className="mt-2">
            If you are caught with multiple accounts, you will be banned from
            the server.
          </p>
        </div>
      </RoundedContent>
    ),
  },
  {
    title: "Can I use cheats or hacks?",
    content: (
      <RoundedContent>
        <div className="flex flex-col w-11/12 mx-auto">
          <h1 className="text-xl">No. You will be banned if you are caught.</h1>
          <p className="mt-2">
            We are very strict on cheating and do not tolerate it at all.
            <br />
            If you suspect someone of cheating, please report them to the staff.
          </p>
        </div>
      </RoundedContent>
    ),
  },
  {
    title: "I think I was restricted unfairly. How can I appeal?",
    content: (
      <RoundedContent>
        <div className="flex flex-col w-11/12 mx-auto">
          <p>
            If you believe you were restricted unfairly, you can appeal your
            restriction by contacting the staff with your case.
            {process.env.NEXT_PUBLIC_DISCORD_LINK && (
              <span>
                You can contact the staff{" "}
                <a
                  href={process.env.NEXT_PUBLIC_DISCORD_LINK}
                  className="text-primary hover:underline"
                >
                  here
                </a>
                .
              </span>
            )}
          </p>
          <div />
        </div>
      </RoundedContent>
    ),
  },
  {
    title: "Can I contribute/suggest changes to the server?",
    content: (
      <RoundedContent>
        <div className="flex flex-col w-11/12 mx-auto">
          <h1 className="text-xl">Yes! We are always open to suggestions.</h1>
          <p className="mt-2">
            If you have any suggestions, please submit them at our{" "}
            <a
              href="https://github.com/SunriseCommunity"
              className="text-primary hover:underline"
            >
              GitHub
            </a>{" "}
            page. <br />
            Longterm contributors can also have chance to get permanent
            supporter tag.
          </p>
        </div>
      </RoundedContent>
    ),
  },
  {
    title:
      "I can’t download maps when I’m in multiplayer, but I can download them from the main menu",
    content: (
      <RoundedContent>
        <div className="flex flex-col w-11/12 mx-auto">
          <h1 className="text-xl">
            Disable{" "}
            <code className="text-primary/80 text-lg">
              Automatically start osu!direct downloads
            </code>{" "}
            from the options and try again.
          </h1>
        </div>
      </RoundedContent>
    ),
  },
];

export default function Wiki() {
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const element = wikiContent.find(
        ({ title: t }) =>
          t === decodeURIComponent(window.location.hash).slice(1)
      );

      if (element) {
        const index = wikiContent.indexOf(element).toString();
        setValue(index);

        const target = document.getElementById(`accordion-item-${index}`);
        target?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname]);

  useEffect(() => {
    const element = wikiContent[tryParseNumber(value) ?? -1];

    window.history.pushState(
      null,
      "",
      pathname + (element ? "#" + encodeURIComponent(element.title) : "")
    );
  }, [value]);

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Wiki" icon={<BookCopy />} roundBottom={true} />

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
            key={index}
            value={index.toString()}
            className="border-b-0"
          >
            <AccordionTrigger className="bg-card rounded-t-lg p-4 flex shadow  [&[data-state=closed]]:rounded-lg">
              <div className="flex space-x-2 items-center">
                <LucideMessageCircleQuestion />
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
