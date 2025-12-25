import { Binoculars } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { EosIconsThreeDotsLoading } from "@/components/ui/icons/three-dots-loading";
import { getUserToken } from "@/lib/actions/getUserToken";
import fetcher from "@/lib/services/fetcher";
import type { BeatmapResponse } from "@/lib/types/api";
import { BeatmapStatusWeb, Mods } from "@/lib/types/api";

const statusMap: Record<number, BeatmapStatusWeb> = {
  0: BeatmapStatusWeb.GRAVEYARD,
  1: BeatmapStatusWeb.PENDING,
  2: BeatmapStatusWeb.RANKED,
  3: BeatmapStatusWeb.APPROVED,
  4: BeatmapStatusWeb.QUALIFIED,
  5: BeatmapStatusWeb.LOVED,
};

type SuggestionStatus = {
  serverName: string;
  suggestedStatus?: BeatmapStatusWeb;
};

export function BeatmapSuggestedSubmissionStatusesTooltip({
  beatmap,
}: {
  beatmap: BeatmapResponse;
}) {
  const [currentGamerule] = useState(Mods.NONE);
  const [suggestions, setSuggestions] = useState<SuggestionStatus[]>([]);

  const fetchData = useCallback(async (force?: boolean) => {
    if (suggestions.length > 0 && !force)
      return;

    const token = await getUserToken();

    const results = await Promise.all(
      [
        {
          serverName: "Akatsuki",
          suggestedStatus: (async () => {
            if (!token) {
              return;
            }
            try {
              const response = await fetch(
                `/api/getBeatmapSuggestion?beatmapId=${beatmap.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              if (!response.ok) {
                return;
              }
              const data: { suggestedStatus?: BeatmapStatusWeb }
                = await response.json();
              return data.suggestedStatus;
            }
            catch {
              // Ignore errors
            }
          })(),
        },
        {
          serverName: "Gatari",
          suggestedStatus: fetcher<{ data: [{ ranked: number }] }>(
            `beatmaps/get?bb=${beatmap.id}`,
            {
              prefixUrl: `https://api.gatari.pw/`,
              credentials: "omit",
            },
          ).then((res) => {
            return statusMap[res?.data?.[0]?.ranked];
          }),
        },
      ].map(async (item) => {
        const suggestedStatus = await item.suggestedStatus;
        return {
          serverName: item.serverName,
          suggestedStatus,
        };
      }),
    );

    setSuggestions(results);
  }, [beatmap.id, suggestions.length]);

  useEffect(() => {
    if (suggestions.length === 0)
      return;
    fetchData(true);
  }, [currentGamerule, fetchData, suggestions.length]);

  return (
    <Tooltip
      onOpenChange={fetchData}
      content={(
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            {suggestions.length > 0 ? (
              suggestions.map((data) => {
                return (
                  <Badge
                    variant="outline"
                    className="place-content-between gap-1"
                    key={`suggestion-status-${data.serverName}`}
                  >
                    <span>{data.serverName}</span>
                    <span> - </span>
                    {data.suggestedStatus ?? "Not found"}
                  </Badge>
                );
              })
            ) : (
              <EosIconsThreeDotsLoading className="mx-auto size-6" />
            )}
          </div>
        </div>
      )}
    >
      <Badge
        variant="outline"
        className="flex size-8 items-center justify-center rounded-full p-0"
      >
        <Binoculars className="size-4" />
      </Badge>
    </Tooltip>
  );
}
