"use client";

import { BookCopy } from "lucide-react";
import { useMemo } from "react";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useT } from "@/lib/i18n/utils";

export default function Rules() {
  const t = useT("pages.rules");
  const tGeneral = useT("pages.rules.sections.generalRules");
  const tChat = useT("pages.rules.sections.chatCommunityRules");
  const tDisclaimer = useT("pages.rules.sections.disclaimer");

  const generalRulesContent = useMemo(
    () => (
      <RoundedContent>
        <div className="mx-auto flex w-11/12 flex-col">
          <ol className="list-inside list-decimal space-y-2">
            <li className="text-xl">
              {tGeneral.rich("noCheating.title")}
              {" "}
              {tGeneral("noCheating.description")}
            </li>
            <span className="text-xs text-secondary-foreground">
              {tGeneral("noCheating.warning")}
            </span>
            <li>
              {tGeneral.rich("noMultiAccount.title")}
              {" "}
              {tGeneral("noMultiAccount.description")}
            </li>
            <li>
              {tGeneral.rich("noImpersonation.title")}
              {" "}
              {tGeneral("noImpersonation.description")}
            </li>
          </ol>
        </div>
      </RoundedContent>
    ),
    [tGeneral],
  );

  const chatCommunityRulesContent = useMemo(
    () => (
      <RoundedContent>
        <div className="mx-auto flex w-11/12 flex-col">
          <ol className="list-inside list-decimal space-y-2">
            <li>
              {tChat.rich("beRespectful.title")}
              {" "}
              {tChat("beRespectful.description")}
            </li>
            <li>
              {tChat.rich("noNSFW.title")}
              {" "}
              {tChat("noNSFW.description")}
            </li>
            <li>
              {tChat.rich("noAdvertising.title")}
              {" "}
              {tChat("noAdvertising.description")}
            </li>
          </ol>
        </div>
      </RoundedContent>
    ),
    [tChat],
  );

  const disclaimerContent = useMemo(
    () => (
      <RoundedContent className="space-y-4">
        <h1>{tDisclaimer("intro")}</h1>

        <div className="mx-auto flex w-11/12 flex-col">
          <ol className="list-inside list-decimal space-y-2">
            <li>
              {tDisclaimer.rich("noLiability.title")}
              {" "}
              {tDisclaimer("noLiability.description")}
            </li>
            <li>
              {tDisclaimer.rich("accountRestrictions.title")}
              {" "}
              {tDisclaimer("accountRestrictions.description")}
            </li>
            <li>
              {tDisclaimer.rich("ruleChanges.title")}
              {" "}
              {tDisclaimer("ruleChanges.description")}
            </li>
            <li>
              {tDisclaimer.rich("agreementByParticipation.title")}
              {" "}
              {tDisclaimer("agreementByParticipation.description")}
            </li>
          </ol>
        </div>
      </RoundedContent>
    ),
    [tDisclaimer],
  );

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text={t("header")} icon={<BookCopy />} roundBottom={true} />

      <div>
        <PrettyHeader text={tGeneral("title")} />
        {generalRulesContent}
      </div>

      <div>
        <PrettyHeader text={tChat("title")} />
        {chatCommunityRulesContent}
      </div>

      <div>
        <PrettyHeader text={tDisclaimer("title")} />
        {disclaimerContent}
      </div>
    </div>
  );
}
