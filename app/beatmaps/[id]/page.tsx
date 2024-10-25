"use client";
import { useEffect } from "react";
import Spinner from "@/components/Spinner";
import { getBeatmap } from "@/lib/actions/getBeatmap";

interface BeatmapsProps {
  params: { id: number };
}

export default function BeatmapsRedirect({ params }: BeatmapsProps) {
  useEffect(() => {
    getBeatmap(params.id).then((res) => {
      if (res.error || !res.data) {
        alert("Error fetching beatmap");
        return;
      }

      window.location.href = `/beatmapsets/${res.data.beatmapset_id}/${params.id}`;
    });
  }, [params.id]);
  return (
    <div className="flex justify-center items-center h-full min-h-96">
      <Spinner size="lg" />
    </div>
  );
}
