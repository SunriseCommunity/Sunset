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

export default function Wiki() {
  return (
    <div className="flex flex-col w-full mt-8">
      {/* Header */}
      <PrettyHeader
        text="Wiki"
        icon={<BookCopy />}
        className="mb-4"
        roundBottom={true}
      />

      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="bg-card rounded-t-lg p-4 flex  shadow">
            <div className="flex space-x-2 items-center">
              <LucideMessageCircleQuestion />
              <p>How to connect</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <h1 className="text-xl">
                  To connect to the server, you need to have a copy of the game
                  installed on your computer. You can download the game from the
                  official osu! website.
                </h1>
                <ol className="list-decimal list-inside mt-2">
                  <li>
                    Locale the <code className="text-primary/80">osu!.exe</code>{" "}
                    file on in game directory.
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b-0">
          <AccordionTrigger className="bg-card rounded-t-lg p-4 flex  shadow">
            <div className="flex space-x-2 items-center">
              <LucideMessageCircleQuestion />
              <p> Can I have multiple accounts?</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <h1 className="text-xl">
                  No. You are only allowed to have one account per person.
                </h1>
                <p className="mt-2">
                  If you are caught with multiple accounts, you will be banned
                  from the server.
                </p>
              </div>
            </RoundedContent>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-b-0">
          <AccordionTrigger className="bg-card rounded-t-lg p-4 flex  shadow">
            <div className="flex space-x-2 items-center">
              <LucideMessageCircleQuestion />
              <p>Can I use cheats or hacks?</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <h1 className="text-xl">
                  No. You will be banned if you are caught.
                </h1>
                <p className="mt-2">
                  We are very strict on cheating and do not tolerate it at all.
                  <br />
                  If you suspect someone of cheating, please report them to the
                  staff.
                </p>
              </div>
            </RoundedContent>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-b-0">
          <AccordionTrigger className="bg-card rounded-t-lg p-4 flex  shadow">
            <div className="flex space-x-2 items-center">
              <LucideMessageCircleQuestion />
              <p>I think I was restricted unfairly. How can I appeal?</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <p>
                  If you believe you were restricted unfairly, you can appeal
                  your restriction by contacting the staff with your case. You
                  can contact the staff{" "}
                  <a
                    href="https://discord.gg/BjV7c9VRfn"
                    className="text-primary hover:underline"
                  >
                    here
                  </a>
                  .
                </p>
                <div />
              </div>
            </RoundedContent>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-b-0">
          <AccordionTrigger className="bg-card rounded-t-lg p-4 flex  shadow">
            <div className="flex space-x-2 items-center">
              <LucideMessageCircleQuestion />
              <p>Can I contribute/suggest changes to the server?</p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <h1 className="text-xl">
                  Yes! We are always open to suggestions.
                </h1>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className="border-b-0">
          <AccordionTrigger className="bg-card rounded-t-lg p-4 flex shadow">
            <div className="flex space-x-2 items-center">
              <LucideMessageCircleQuestion />
              <p>
                I can’t download maps when I’m in multiplayer, but I can
                download them from the main menu
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
