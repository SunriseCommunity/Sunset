import { BeatmapResponse, BeatmapSetResponse } from "@/lib/types/api";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      href={
        (isAdminDashboard ? "/admin" : "") +
        `/beatmapsets/${beatmapSet.id}${
          beatmap && !isAdminDashboard ? `/${beatmap.id}` : ""
        }`
      }
    >
      <span className="text-primary font-bold mx-1">
        <span>
          <Image
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
            alt={`${beatmapSet.id}'s thumbnail`}
            width={16}
            height={16}
            className="object-cover rounded align-middle inline-block mr-1"
          />
        </span>
        {beatmapSet.artist} - {beatmapSet.title}
        {beatmap ? ` [${beatmap.version}]` : ""}
      </span>
    </Link>
  );
}
