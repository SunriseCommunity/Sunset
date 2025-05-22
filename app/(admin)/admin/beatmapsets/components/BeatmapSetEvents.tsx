import { BeatmapSetEvent } from "@/app/(admin)/admin/beatmapsets/components/BeatmapSetEvent";
import { Button } from "@/components/ui/button";
import { useBeatmapSetEvents } from "@/lib/hooks/api/beatmap/useBeatmapSetEvents";
import { BeatmapSetResponse } from "@/lib/types/api";
import { ChevronDown } from "lucide-react";

export function BeatmapSetEvents({
  beatmapSet,
}: {
  beatmapSet: BeatmapSetResponse;
}) {
  const { data, setSize, size, isLoading } = useBeatmapSetEvents(
    beatmapSet.id,
    5
  );

  const events = data?.flatMap((item) => item.events);
  const totalCount =
    data?.find((item) => item.total_count !== undefined)?.total_count ?? 0;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const handleShowMore = () => {
    setSize(size + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      {events?.map((event, i) => {
        return <BeatmapSetEvent key={i} event={event} />;
      })}
      {events && events?.length < totalCount && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleShowMore}
            className="w-full md:w-1/2 flex items-center justify-center"
            isLoading={isLoadingMore}
            variant="secondary"
          >
            <ChevronDown />
            Show more
          </Button>
        </div>
      )}
    </div>
  );
}
