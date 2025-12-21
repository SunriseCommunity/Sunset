import { BeatmapNomination } from "@/app/(website)/beatmapsets/components/BeatmapNomination";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BeatmapResponse, BeatmapSetResponse } from "@/lib/types/api";
import { Info, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/utils";

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

  return isScreenSmall || !beatmapSet.can_be_hyped ? (
    <div className="h-full space-y-2">
      {beatmapSet.can_be_hyped && (
        <div className="text-sm">
          <PrettyHeader>
            <div className="flex space-x-2 items-center">
              <Rocket />
              <p className="text-sm">{t("communityHype")}</p>
            </div>
          </PrettyHeader>
          <RoundedContent className="space-y-4 flex-1 min-h-0 overflow-y-auto">
            <BeatmapNomination beatmap={beatmap} />
          </RoundedContent>
        </div>
      )}
      <div className="h-full">
        <PrettyHeader>
          <div className="flex space-x-2 items-center">
            <Info />
            <p className="text-sm">{t("information")}</p>
          </div>
        </PrettyHeader>
        <RoundedContent className="space-y-4 flex-1 min-h-0 lg:h-64 overflow-y-auto">
          <BeatmapMetadata beatmapSet={beatmapSet} />
        </RoundedContent>
      </div>
    </div>
  ) : (
    <Accordion type="single" className="space-y-2" defaultValue="info">
      {beatmapSet.can_be_hyped && (
        <AccordionItem value="hype" className="border-0">
          <AccordionTrigger className="bg-card border rounded-t-lg p-4 flex shadow [&[data-state=closed]]:rounded-lg">
            <div className="flex space-x-2 items-center">
              <Rocket />
              <p>{t("communityHype")}</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="max-h-52 flex flex-col pb-0">
            <RoundedContent className="space-y-4 flex-1 min-h-0 overflow-y-auto">
              <BeatmapNomination beatmap={beatmap} />
            </RoundedContent>
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem value="info" className="border-0" defaultChecked>
        <AccordionTrigger className="bg-card border rounded-t-lg p-4 flex shadow [&[data-state=closed]]:rounded-lg">
          <div className="flex space-x-2 items-center">
            <Info />
            <p>{t("information")}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="max-h-52 flex flex-col ">
          <RoundedContent className="space-y-4 flex-1 min-h-0 overflow-y-auto">
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
          <p className="text-sm font-bald">{beatmapSet.genre}</p>
        </div>
        <div className="flex place-content-between items-end">
          <p className="text-xs">{t("language")}</p>
          <p className="text-sm font-bald">{beatmapSet.language}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-xs">{t("tags")}</p>
        <p className="text-sm font-light ">
          {beatmapSet.tags.map((tag) => `${tag}`).join(", ")}
        </p>
      </div>
    </>
  );
}
