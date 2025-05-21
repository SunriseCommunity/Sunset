import { BeatmapNominatorUser } from "@/app/(website)/beatmapsets/components/BeatmapNominatorUser";
import PrettyDate from "@/components/General/PrettyDate";
import { SmallBeatmapElement } from "@/components/SmallBeatmapElement";
import { BeatmapEventResponse, BeatmapEventType } from "@/lib/types/api";
import { Clock } from "lucide-react";

export function BeatmapSetEvent({ event }: { event: BeatmapEventResponse }) {
  const {
    executor,
    beatmap_hash,
    new_status,
    created_at,
    event_id,
    beatmapset,
  } = event;

  let eventMessage: React.ReactNode = "";

  switch (event.type) {
    case BeatmapEventType.BEATMAP_SET_HYPED:
      eventMessage = (
        <>
          hyped beatmapset
          <SmallBeatmapElement beatmapSet={beatmapset} />
        </>
      );
      break;
    case BeatmapEventType.BEATMAP_SET_HYPE_CLEARED:
      eventMessage = (
        <>
          reset beatmapset
          <SmallBeatmapElement beatmapSet={beatmapset} /> hypes
        </>
      );
      break;
    case BeatmapEventType.BEATMAP_STATUS_CHANGED:
      const beatmap = beatmapset.beatmaps.find((b) => b.hash === beatmap_hash);
      eventMessage = (
        <>
          changed beatmap
          <SmallBeatmapElement beatmapSet={beatmapset} beatmap={beatmap} />
          status to
          <p className="text-primary font-semibold">
            {new_status ?? "their default status"}
          </p>
        </>
      );
      break;
    default:
      eventMessage =
        "created unhandled event. Please report it to the developer";
      break;
  }

  return (
    <div className="flex p-2 bg-accent rounded-lg">
      <div className="flex flex-wrap gap-5 w-full items-center place-content-between text-sm font-normal">
        <div className="flex gap-5 w-3/4">
          <p className="text-nowrap">ID: {event_id}</p>
          <div className="flex flex-wrap gap-1">
            <p>User </p>
            <BeatmapNominatorUser user={executor} />
            {eventMessage}.
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <Clock className="w-4 h-4" />
          <PrettyDate time={created_at} />
        </div>
      </div>
    </div>
  );
}
