"use client";
import Spinner from "@/components/Spinner";
import { LucideHistory } from "lucide-react";
import { useEffect, useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import { Score as ScoreType } from "@/lib/types/Score";
import RoundedContent from "@/components/General/RoundedContent";
import { getTopPlays } from "@/lib/actions/getTopPlays";
import { GameMode } from "@/lib/types/GameMode";
import PrettyButton from "@/components/General/PrettyButton";
import UserScoreMinimal from "./components/UserScoreMinimal";
import GameModeSelector from "@/components/GameModeSelector";

export default function Topplays() {
  const [scores, setScores] = useState<ScoreType[] | null>(null);
  const [activeMode, setActiveMode] = useState(GameMode.std);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getTopPlays(activeMode).then((res) => {
      if (res.error || !res.data) {
        alert("Error fetching score");
        return;
      }

      setScores(res.data.scores);

      setIsLoading(false);
    });
  }, [activeMode]);

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader
        text="Top plays"
        icon={<LucideHistory />}
        className="mb-4"
        roundBottom={true}
      />

      <PrettyHeader>
        <GameModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </PrettyHeader>

      {isLoading && (
        <div className="flex justify-center items-center h-96">
          <Spinner size="xl" />
        </div>
      )}

      {!isLoading && scores && (
        <div className="bg-coffee-600 rounded-b-3xl mb-4">
          <RoundedContent className="min-h-0 h-fit max-h-none rounded-t-xl">
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
      )}
    </div>
  );
}
