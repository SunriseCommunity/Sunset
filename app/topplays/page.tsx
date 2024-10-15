"use client";
import Spinner from "@/components/Spinner";
import { LucideHistory } from "lucide-react";
import { useEffect, useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import { Score as ScoreType } from "@/lib/types/Score";
import RoundedContent from "@/components/General/RoundedContent";
import useSelf from "@/lib/hooks/useSelf";
import { getTopPlays } from "@/lib/actions/getTopPlays";
import { GameMode } from "@/lib/types/GameMode";
import PrettyButton from "@/components/General/PrettyButton";
import UserScoreMinimal from "./components/UserScoreMinimal";

const defaultGamemodes = ["osu!std", "osu!taiko", "osu!catch", "osu!mania"];

export default function Topplays() {
  const [scores, setScores] = useState<ScoreType[] | null>(null);
  const [activeMode, setActiveMode] = useState("osu!std");
  const [isLoading, setIsLoading] = useState(false);

  const activeGameMode =
    GameMode[activeMode.replace("osu!", "") as keyof typeof GameMode];

  useEffect(() => {
    setIsLoading(true);

    getTopPlays(activeGameMode).then((res) => {
      if (res.error || !res.data) {
        alert("Error fetching score");
        return;
      }

      setScores(res.data.scores);

      setIsLoading(false);
    });
  }, [activeGameMode]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader text="Top plays" icon={<LucideHistory />}>
        <div className="flex space-x-2">
          {defaultGamemodes.map((mode) => (
            <PrettyButton
              text={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-3 py-1 ${
                activeMode === mode ? "bg-terracotta-400 text-white" : ""
              }`}
              key={mode}
            />
          ))}
        </div>
      </PrettyHeader>

      <RoundedContent className="min-h-0 h-fit max-h-none mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scores?.map((score) => (
            <div key={`score-${score.id}`} className="mb-2">
              <UserScoreMinimal score={score} />
            </div>
          ))}
        </div>
        {/* TODO: Add pagination then after I fix issues with beatmaps API on backend */}
      </RoundedContent>
    </div>
  );
}
