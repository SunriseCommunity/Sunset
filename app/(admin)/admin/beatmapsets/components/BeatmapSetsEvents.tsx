import { ChevronDown } from "lucide-react";

import { BeatmapSetEvent } from "@/app/(admin)/admin/beatmapsets/components/BeatmapSetEvent";
import { Button } from "@/components/ui/button";
import { useBeatmapsSetEvents } from "@/lib/hooks/api/beatmap/useBeatmapSetsEvents";

export function BeatmapSetsEvents() {
  const { data, setSize, size, isLoading } = useBeatmapsSetEvents(5);

  const events = data?.flatMap(item => item.events);
  const totalCount
    = data?.find(item => item.total_count !== undefined)?.total_count ?? 0;

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);

  const handleShowMore = () => {
    setSize(size + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      {events?.map((event) => {
        return <BeatmapSetEvent key={`beatmap-set-event-${event.event_id}`} event={event} />;
      })}
      {events && events?.length < totalCount && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleShowMore}
            className="flex w-full items-center justify-center md:w-1/2"
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
