"use client";
import { BookCopy, LucideMessageCircleQuestion } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";

export default function Wiki() {
  return (
    <div className="flex flex-col w-full mt-8">
      {/* Header */}
      <PrettyHeader
        text="Wiki"
        icon={<BookCopy />}
        className="bg-terracotta-700 mb-4"
        roundBottom={true}
      />

      <PrettyHeader
        text="How to connect"
        icon={<LucideMessageCircleQuestion />}
      />
      <RoundedContent className="mb-4 bg-terracotta-700">
        <div className="flex flex-col w-11/12 mx-auto">
          <h1 className="text-xl">
            To connect to the server, you need to have a copy of the game
            installed on your computer. You can download the game from the
            official osu! website.
          </h1>
          <ol className="list-decimal list-inside mt-2">
            <li>
              Locale the <code className="text-yellow-pastel">osu!.exe</code>{" "}
              file on in game directory.
            </li>
            <li>Create a shortcut of the file.</li>
            <li>Right click on the shortcut and select properties.</li>
            <li>
              In the target field, add{" "}
              <code className="text-yellow-pastel">
                --devserver osu-sunrise.top
              </code>{" "}
              at the end of the path.
            </li>
            <li>Click apply and then OK.</li>
            <li>Double click on the shortcut to start the game.</li>
          </ol>
        </div>
      </RoundedContent>
      <PrettyHeader
        text="Can I have multiple accounts?"
        icon={<LucideMessageCircleQuestion />}
      />
      <RoundedContent className="mb-4 bg-terracotta-700 h-fit min-h-fit max-h-fit">
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

      <PrettyHeader
        text="I can’t download maps when I’m in multiplayer, but I can download them from the main menu"
        icon={<LucideMessageCircleQuestion />}
      />
      <RoundedContent className="mb-4 bg-terracotta-700 h-fit min-h-fit max-h-fit">
        <div className="flex flex-col w-11/12 mx-auto">
          <h1 className="text-xl">
            Disable{" "}
            <code className="text-yellow-pastel text-lg">
              Automatically start osu!direct downloads
            </code>{" "}
            from the options and try again.
          </h1>
        </div>
      </RoundedContent>
    </div>
  );
}
