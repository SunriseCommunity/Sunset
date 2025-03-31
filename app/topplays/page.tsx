"use client";
import Spinner from "@/components/Spinner";
import { LucideHistory } from "lucide-react";
import { useEffect, useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { getTopPlays } from "@/lib/actions/getTopPlays";
import { GameMode } from "@/lib/hooks/api/types";
import UserScoreMinimal from "./components/UserScoreMinimal";
import GameModeSelector from "@/components/GameModeSelector";
import { Score } from "@/lib/hooks/api/score/types";

export default function Topplays() {
  const [scores, setScores] = useState<Score[] | null>(null);
  const [activeMode, setActiveMode] = useState(GameMode.std);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentMode = activeMode;
    setIsLoading(true);

    getTopPlays(activeMode).then((res) => {
      if (currentMode !== activeMode) return;

      if (res.error || !res.data) {
        alert("Error fetching score");
        setIsLoading(false);
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
