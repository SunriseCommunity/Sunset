"use client";
import Spinner from "@/components/Spinner";
import { ChevronDown, LucideHistory } from "lucide-react";
import { useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { GameMode } from "@/lib/hooks/api/types";
import UserScoreMinimal from "./components/UserScoreMinimal";
import GameModeSelector from "@/components/GameModeSelector";
import { useTopScores } from "@/lib/hooks/api/score/useTopScores";
import PrettyButton from "@/components/General/PrettyButton";
import { Button } from "@/components/ui/button";

export default function Topplays() {
  const [activeMode, setActiveMode] = useState(GameMode.std);

  const { data, setSize, size, isLoading, isValidating } = useTopScores(
    activeMode,
    20
  );

  const handleShowMore = () => {
    setSize(size + 1);
  };

  const scores = data?.flatMap((item) => item.scores);

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

            {scores.length < 100 && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleShowMore}
                  className="w-full md:w-1/2 flex items-center justify-center"
                  isLoading={isLoading || isValidating}
                  variant="secondary"
                >
                  <ChevronDown />
                  Show more
                </Button>
              </div>
            )}
          </RoundedContent>
        </div>
      )}
    </div>
  );
}
