"use client";
import Spinner from "@/components/Spinner";
import { Download, DownloadCloud, LucideHistory } from "lucide-react";
import { useEffect, useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import { getScore } from "@/lib/actions/getScore";
import { Score as ScoreType } from "@/lib/types/Score";
import Image from "next/image";
import RoundedContent from "@/components/General/RoundedContent";
import { getBeatmap } from "@/lib/actions/getBeatmap";
import { Beatmap } from "@/lib/types/Beatmap";
import PrettyDate from "@/components/General/PrettyDate";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import UserElement from "@/components/UserElement";
import { User } from "@/lib/types/User";
import { getUser } from "@/lib/actions/getUser";
import PrettyButton from "@/components/General/PrettyButton";
import useSelf from "@/lib/hooks/useSelf";
import { downloadReplay } from "@/lib/actions/downloadReplay";
import { twMerge } from "tailwind-merge";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

export default function Score({ params }: { params: { id: number } }) {
  const [score, setScore] = useState<ScoreType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [beatmap, setBeatmap] = useState<Beatmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReplayLoading, setIsReplayLoading] = useState(false);

  const { self } = useSelf();

  useEffect(() => {
    setIsLoading(true);

    getScore(params.id).then((res) => {
      if (res.error || !res.data) {
        alert("Error fetching score");
        return;
      }

      setScore(res.data);

      getUser(res.data.user_id).then((resUser) => {
        if (res.error) return;
        setUser(resUser.data);

        getBeatmap(res.data!.beatmap_id).then((res) => {
          if (res.error) return;
          setBeatmap(res.data);

          setIsLoading(false);
        });
      });
    });
  }, [params.id]);

  const handleDownloadReplay = () => {
    if (!score) return;
    setIsReplayLoading(true);

    downloadReplay(score.id).then((res) => {
      if (res.error) {
        alert(res.error);
      }
      setIsReplayLoading(false);
    });
  };

  if (isLoading || score === null || user === null)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader text="Score Performance" icon={<LucideHistory />} />
      <RoundedContent className="min-h-0 h-fit max-h-none mb-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="h-64 relative">
              <Image
                src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover.jpg`}
                alt=""
                fill={true}
                objectFit="cover"
                className="bg-stone-700 rounded-lg"
              />
              <div className="absolute inset-0 bg-terracotta-800 bg-opacity-80 lg:p-6 md:p-4 p-2 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <a
                    href={`/beatmapsets/${beatmap?.beatmapset_id}/${beatmap?.id}`}
                  >
                    <h3 className="text-2xl font-bold">{beatmap?.title}</h3>
                    <p className="text-gray-300">by {beatmap?.artist}</p>
                  </a>
                  <div className="text-right">
                    <p className="text-yellow-400 text-base">
                      [{beatmap?.version || "Unknown"}] ★{" "}
                      {beatmap && getBeatmapStarRating(beatmap).toFixed(2)}{" "}
                      {score.mods}
                    </p>
                    <p className="text-gray-300">
                      mapped by {beatmap?.creator || "Unknown Creator"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div
                    className={`text-${getGradeColor(
                      score.grade
                    )} text-9xl font-bold`}
                  >
                    {score.grade}
                  </div>
                  <div>
                    <p className="text-6xl font-bold text-right">
                      {score.total_score.toLocaleString()}
                    </p>
                    <div className="text-right">
                      <div className="flex flex-row items-center justify-end">
                        <p className="text-gray-200">Submitted on&nbsp;</p>
                        <PrettyDate
                          className="text-gray-200"
                          time={score.when_played}
                        />
                      </div>
                      <p className="text-gray-200">Played by {user.username}</p>
                      <PrettyButton
                        onClick={handleDownloadReplay}
                        text="Download Replay"
                        icon={<Download />}
                        className="py-1 px-2 mt-2"
                        disabled={!self || !score.has_replay}
                        isLoading={isReplayLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center">
              <UserElement user={user} className="w-1/3 space-y-2" />

              <div className="flex flex-col space-y-2 w-1/3">
                <div className="grid grid-cols-3 gap-4 mb-1">
                  <div className="bg-terracotta-800 p-3 rounded">
                    <p className="text-gray-400">Accuracy</p>
                    <p className="text-base font-bold">
                      {score.accuracy.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-terracotta-800 p-3 rounded">
                    <p className="text-gray-400">Combo</p>
                    <p
                      className={twMerge(
                        "text-base font-bold",
                        score.max_combo === beatmap?.max_combo
                          ? "text-terracotta-300"
                          : ""
                      )}
                    >
                      {score.max_combo}x
                    </p>
                  </div>
                  <div className="bg-terracotta-800 p-3 rounded">
                    <p className="text-gray-400">PP</p>
                    <p className="text-base font-bold">
                      {score.performance_points.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">300</p>
                    <p className="text-base">{score.count_300}</p>
                  </div>
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">100</p>
                    <p className="text-base">{score.count_100}</p>
                  </div>
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">50</p>
                    <p className="text-base">{score.count_50}</p>
                  </div>
                  <div className="bg-terracotta-800 p-2 rounded text-center">
                    <p className="text-gray-400">Miss</p>
                    <p className="text-base">{score.count_miss}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RoundedContent>
    </div>
  );
}
