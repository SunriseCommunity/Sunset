"use client";

import SkeletonLoading from "@/components/SkeletonLoading";
import { getBeatmap } from "@/lib/actions/getBeatmap";
import { getUser } from "@/lib/actions/getUser";
import { Beatmap } from "@/lib/types/Beatmap";
import { Score } from "@/lib/types/Score";
import { User } from "@/lib/types/User";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface UserScoreMinimalProps {
  score: Score;
  className?: string;
}

export default function UserScoreMinimal({
  score,
  className,
}: UserScoreMinimalProps) {
  const [beatmap, setBeatmap] = useState<Beatmap | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getBeatmap(score.beatmap_id).then((res) => {
      if (res.error) return;
      setBeatmap(res.data);

      getUser(score.user_id).then((res) => {
        if (res.error) return;
        setUser(res.data);
      });
    });
  }, [score]);

  return (
    <div
      className={twMerge(
        "bg-terracotta-700 rounded-lg overflow-hidden",
        className
      )}
      onClick={() => (window.location.href = `/score/${score.id}`)}
    >
      <div className="h-28 relative">
        <Image
          src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
          alt=""
          fill={true}
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-terracotta-200 to-transparent flex items-center cursor-pointer">
          <div className="py-2 px-4 flex place-content-between bg-black hover:bg-opacity-40 bg-opacity-50 w-full h-full smooth-transition ">
            <div className="flex-col h-full flex justify-between overflow-hidden ">
              <div className="flex-col overflow-hidden flex-wrap">
                <h1 className="font-bold text-sm drop-shadow-md flex text-ellipsis">
                  {beatmap?.artist ?? <SkeletonLoading className="w-20 h-3" />}
                  &nbsp;-&nbsp;
                  {beatmap?.title ?? <SkeletonLoading className="w-28 h-3" />}
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-xs drop-shadow-md text-gray-100 ">
                    {beatmap?.version ?? (
                      <SkeletonLoading className="w-16 h-3" />
                    )}
                  </p>
                </div>
              </div>
              <div className="flex pb-1">
                <div className="rounded-md overflow-hidden border-2 border-white mr-2">
                  <Image
                    src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${user?.user_id}`}
                    alt=""
                    objectFit="cover"
                    width={24}
                    height={24}
                  />
                </div>

                <h2 className="text-white text-md font-bold mr-2">
                  {user?.username ?? <SkeletonLoading className="w-24 h-4" />}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-end text-nowrap">
                <p className="text-md opacity-70">{score.mods}</p>
                <p className="text-2xl text-terracotta-300">
                  {beatmap?.ranked == 1
                    ? score.performance_points.toFixed()
                    : "- "}
                  pp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
