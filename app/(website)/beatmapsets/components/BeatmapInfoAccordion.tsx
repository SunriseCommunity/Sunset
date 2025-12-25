import { Info, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

import { BeatmapNomination } from "@/app/(website)/beatmapsets/components/BeatmapNomination";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse, BeatmapSetResponse } from "@/lib/types/api";

export function BeatmapInfoAccordion({
  beatmapSet,
  beatmap,
}: {
  beatmapSet: BeatmapSetResponse;
  beatmap: BeatmapResponse;
}) {
  const t = useT("pages.beatmapsets.components.infoAccordion");
  const [isScreenSmall, setAccordionType] = useState<boolean>(false);

  useEffect(() => {
    const lgBreakpoint = "(min-width: 1024px)";
    const mediaQuery = window.matchMedia(lgBreakpoint);
    const updateType = () => {
      setAccordionType(mediaQuery.matches ? false : true);
    };

    updateType();
    mediaQuery.addEventListener("change", updateType);

    return () => {
      mediaQuery.removeEventListener("change", updateType);
    };
  }, []);

  return isScreenSmall || !beatmapSet.can_be_hyped
    ? (
        <div className="h-full space-y-2">
          {beatmapSet.can_be_hyped && (
            <div className="text-sm">
              <PrettyHeader>
                <div className="flex items-center space-x-2">
                  <Rocket />
                  <p className="text-sm">{t("communityHype")}</p>
                </div>
              </PrettyHeader>
              <RoundedContent className="min-h-0 flex-1 space-y-4 overflow-y-auto">
                <BeatmapNomination beatmap={beatmap} />
              </RoundedContent>
            </div>
          )}
          <div className="h-full">
            <PrettyHeader>
              <div className="flex items-center space-x-2">
                <Info />
                <p className="text-sm">{t("information")}</p>
              </div>
            </PrettyHeader>
            <RoundedContent className="min-h-0 flex-1 space-y-4 overflow-y-auto lg:h-64">
              <BeatmapMetadata beatmapSet={beatmapSet} />
            </RoundedContent>
          </div>
        </div>
      )
    : (
        <Accordion type="single" className="space-y-2" defaultValue="info">
          {beatmapSet.can_be_hyped && (
            <AccordionItem value="hype" className="border-0">
              <AccordionTrigger className="flex rounded-t-lg border bg-card p-4 shadow [&[data-state=closed]]:rounded-lg">
                <div className="flex items-center space-x-2">
                  <Rocket />
                  <p>{t("communityHype")}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex max-h-52 flex-col pb-0">
                <RoundedContent className="min-h-0 flex-1 space-y-4 overflow-y-auto">
                  <BeatmapNomination beatmap={beatmap} />
                </RoundedContent>
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="info" className="border-0" defaultChecked>
            <AccordionTrigger className="flex rounded-t-lg border bg-card p-4 shadow [&[data-state=closed]]:rounded-lg">
              <div className="flex items-center space-x-2">
                <Info />
                <p>{t("information")}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex max-h-52 flex-col ">
              <RoundedContent className="min-h-0 flex-1 space-y-4 overflow-y-auto">
                <BeatmapMetadata beatmapSet={beatmapSet} />
              </RoundedContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
}

function BeatmapMetadata({ beatmapSet }: { beatmapSet: BeatmapSetResponse }) {
  const t = useT("pages.beatmapsets.components.infoAccordion.metadata");
  return (
    <>
      <div className="">
        <div className="flex place-content-between items-end">
          <p className="text-xs">{t("genre")}</p>
          <p className="font-bald text-sm">{beatmapSet.genre}</p>
        </div>
        <div className="flex place-content-between items-end">
          <p className="text-xs">{t("language")}</p>
          <p className="font-bald text-sm">{beatmapSet.language}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-xs">{t("tags")}</p>
        <p className="text-sm font-light ">
          {beatmapSet.tags.map(tag => `${tag}`).join(", ")}
        </p>
      </div>
    </>
  );
}
