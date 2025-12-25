import Link from "next/link";
import { usePathname } from "next/navigation";

import ImageWithFallback from "@/components/ImageWithFallback";
import type { BeatmapResponse, BeatmapSetResponse } from "@/lib/types/api";

interface SmallBeatmapElementProps {
  beatmapSet: BeatmapSetResponse;
  beatmap?: BeatmapResponse;
}

export function SmallBeatmapElement({
  beatmapSet,
  beatmap,
}: SmallBeatmapElementProps) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.includes("/admin/");

  return (
    <Link
      href={`${isAdminDashboard ? "/admin" : ""
         }/beatmapsets/${beatmapSet.id}${
          beatmap && !isAdminDashboard ? `/${beatmap.id}` : ""
        }`}
    >
      <span className="mx-1 font-bold text-primary">
        <span>
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
            alt={`${beatmapSet.id}'s thumbnail`}
            width={16}
            height={16}
            className="mr-1 inline-block aspect-square rounded object-cover align-middle"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />
        </span>
        {beatmapSet.artist}
        {" "}
        -
        {beatmapSet.title}
        {beatmap ? ` [${beatmap.version}]` : ""}
      </span>
    </Link>
  );
}
