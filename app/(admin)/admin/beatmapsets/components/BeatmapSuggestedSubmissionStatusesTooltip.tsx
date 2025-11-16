import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { EosIconsThreeDotsLoading } from "@/components/ui/icons/three-dots-loading";
import fetcher from "@/lib/services/fetcher";
import { BeatmapResponse, BeatmapStatusWeb, Mods } from "@/lib/types/api";
import { getUserToken } from "@/lib/actions/getUserToken";
import { Binoculars } from "lucide-react";
import { useEffect, useState } from "react";

const statusMap: { [key: number]: BeatmapStatusWeb } = {
  0: BeatmapStatusWeb.GRAVEYARD,
  1: BeatmapStatusWeb.PENDING,
  2: BeatmapStatusWeb.RANKED,
  3: BeatmapStatusWeb.APPROVED,
  4: BeatmapStatusWeb.QUALIFIED,
  5: BeatmapStatusWeb.LOVED,
};

export function BeatmapSuggestedSubmissionStatusesTooltip({
  beatmap,
}: {
  beatmap: BeatmapResponse;
}) {
  const [currentGamerule, setCurrentGamerule] = useState(Mods.NONE);
  const [suggestions, setSuggestions] = useState<
    { serverName: string; suggestedStatus?: BeatmapStatusWeb }[]
  >([]);

  const fetchData = async (force?: boolean) => {
    if (suggestions.length > 0 && !force) return;

    const token = await getUserToken();

    const results = await Promise.all(
      [
        {
          serverName: "Akatsuki",
          suggestedStatus: (async () => {
            if (!token) {
              return undefined;
            }
            try {
              const response = await fetch(
                `/api/getBeatmapSuggestion?beatmapId=${beatmap.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (!response.ok) {
                return undefined;
              }
              const data: { suggestedStatus?: BeatmapStatusWeb } =
                await response.json();
              return data.suggestedStatus;
            } catch {
              return undefined;
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
            }
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
      })
    );

    setSuggestions(results);
  };

  useEffect(() => {
    if (suggestions.length == 0) return;
    fetchData(true);
  }, [currentGamerule]);

  return (
    <Tooltip
      onOpenChange={fetchData}
      content={
        <div className="flex gap-2 flex-col">
          <div className="flex gap-1 flex-col">
            {suggestions.length > 0 ? (
              suggestions.map((data, i) => {
                return (
                  <Badge
                    variant="outline"
                    className="place-content-between gap-1"
                    key={i}
                  >
                    <span>{data.serverName}</span>
                    <span> - </span>
                    {data.suggestedStatus ?? "Not found"}
                  </Badge>
                );
              })
            ) : (
              <EosIconsThreeDotsLoading className="h-6 w-6 mx-auto" />
            )}
          </div>
        </div>
      }
    >
      <Badge
        variant="outline"
        className="rounded-full w-8 h-8 flex items-center justify-center p-0"
      >
        <Binoculars className="w-4 h-4" />
      </Badge>
    </Tooltip>
  );
}
