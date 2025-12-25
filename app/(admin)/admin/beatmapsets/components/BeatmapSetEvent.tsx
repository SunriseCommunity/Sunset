import { Clock } from "lucide-react";

import { BeatmapNominatorUser } from "@/app/(website)/beatmapsets/components/BeatmapNominatorUser";
import PrettyDate from "@/components/General/PrettyDate";
import { SmallBeatmapElement } from "@/components/SmallBeatmapElement";
import type { BeatmapEventResponse } from "@/lib/types/api";
import { BeatmapEventType } from "@/lib/types/api";

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
          <SmallBeatmapElement beatmapSet={beatmapset} />
          {" "}
          hypes
        </>
      );
      break;
    case BeatmapEventType.BEATMAP_STATUS_CHANGED:
      eventMessage = (
        <>
          changed beatmap
          <SmallBeatmapElement beatmapSet={beatmapset} beatmap={beatmapset.beatmaps.find(b => b.hash === beatmap_hash)} />
          status to
          <span className="ml-1 font-semibold text-primary">
            {new_status ?? "their default status"}
          </span>
        </>
      );
      break;
    default:
      eventMessage
        = "created unhandled event. Please report it to the developer";
      break;
  }

  return (
    <div className="flex rounded-lg bg-accent p-2">
      <div className="flex w-full flex-wrap place-content-between items-center gap-5 text-sm font-normal">
        <div className="flex w-3/4 gap-5">
          <p className="text-nowrap">ID: {event_id}</p>
          <p>
            <span>User </span>
            <BeatmapNominatorUser user={executor} />
            <span>{eventMessage}.</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="size-4" />
          <PrettyDate time={created_at} />
        </div>
      </div>
    </div>
  );
}
