import { BookCopy } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";

export default function Wiki() {
  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Rules" icon={<BookCopy />} roundBottom={true} />

      <div>
        <PrettyHeader text="General rules" />
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <ol className="list-decimal list-inside space-y-2">
              <li className="text-xl">
                <span className="font-bold">No Cheating or Hacking. </span> Any
                form of cheating, including aimbots, relax hacks, macros, or
                modified clients that give unfair advantage is strictly
                prohibited. Play fair, improve fair.
              </li>
              <span className="text-secondary-foreground text-xs">
                As you can see, I wrote this in a bigger font for all you
                "wannabe" cheaters who think you can migrate from another
                private server to here after being banned. You will be found and
                executed (in Minecraft) if you cheat. So please, don’t.
              </span>
              <li>
                <span className="font-bold">
                  No Multi-Accounting or Account Sharing.{" "}
                </span>
                Only one account per player is allowed. If your primary account
                was restricted without an explanation, please contact support.
              </li>
              <li>
                <span className="font-bold">
                  No Impersonating Popular Players or Staff{" "}
                </span>
                Do not pretend to be a staff member or any well-known player.
                Misleading others can result in a username change or permanent
                ban.
              </li>
            </ol>
          </div>
        </RoundedContent>
      </div>

      <div>
        <PrettyHeader text="Chat & Community Rules" />
        <RoundedContent>
          <div className="flex flex-col w-11/12 mx-auto">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <span className="font-bold">Be Respectful. </span>Treat others
                with kindness. Harassment, hate speech, discrimination, or toxic
                behaviour won’t be tolerated.
              </li>
              <li>
                <span className="font-bold">
                  No NSFW or Inappropriate Content{" "}
                </span>
                Keep the server appropriate for all audiences — this applies to
                all user content, including but not limited to usernames,
                banners, avatars and profile descriptions.
              </li>
              <li>
                <span className="font-bold">Advertising is forbidden. </span>
                Don’t promote other servers, websites, or products without admin
                approval.
              </li>
            </ol>
          </div>
        </RoundedContent>
      </div>

      <div>
        <PrettyHeader text="Important Disclaimer" />
        <RoundedContent className="space-y-4">
          <h1>
            By creating and/or maintaining an account on our platform, you
            acknowledge and agree to the following terms:
          </h1>

          <div className="flex flex-col w-11/12 mx-auto">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <span className="font-bold">No Liability. </span>You accept full
                responsibility for your participation in any services provided
                by Sunrise and acknowledge that you cannot hold the organization
                accountable for any consequences that may arise from your usage.
              </li>
              <li>
                <span className="font-bold">Account Restrictions. </span>
                The administration reserves the right to restrict or suspend any
                account, with or without prior notice, for violations of server
                rules or at their discretion.
              </li>
              <li>
                <span className="font-bold">Rule Changes. </span>
                The server rules are subject to change at any time. The
                administration may update, modify, or remove any rule with or
                without prior notification, and all players are expected to stay
                informed of any changes.
              </li>
              <li>
                <span className="font-bold">Agreement by Participation. </span>
                By creating and/or maintaining an account on the server, you
                automatically agree to these terms and commit to adhering to the
                rules and guidelines in effect at the time.
              </li>
            </ol>
          </div>
        </RoundedContent>
      </div>
    </div>
  );
}
