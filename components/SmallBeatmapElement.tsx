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
      <div className="flex gap-1 items-center">
        <div className="relative w-4 h-4 overflow-hidden rounded">
          <Image
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
            alt={`${beatmapSet.id}'s thumbnail`}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <span className="text-primary font-semibold">
          {beatmapSet.artist} - {beatmapSet.title}{" "}
          {beatmap ? `[${beatmap.version}]` : ""}
        </span>
      </div>
    </Link>
  );
}
