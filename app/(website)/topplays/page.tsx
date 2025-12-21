"use client";
import Spinner from "@/components/Spinner";
import { ChevronDown, LucideHistory } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import UserScoreMinimal from "./components/UserScoreMinimal";
import GameModeSelector from "@/components/GameModeSelector";
import { useTopScores } from "@/lib/hooks/api/score/useTopScores";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { GameMode } from "@/lib/types/api";
import { isInstance } from "@/lib/utils/type.util";
import { useT } from "@/lib/i18n/utils";

export default function Topplays() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useT("pages.topplays");

  const mode = searchParams.get("mode") ?? GameMode.STANDARD;

  const [activeMode, setActiveMode] = useState(
    isInstance(mode, GameMode) ? (mode as GameMode) : GameMode.STANDARD
  );

  const { data, setSize, size, isLoading } = useTopScores(activeMode, 20);

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const handleShowMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  const scores = data?.flatMap((item) => item.scores);
  const totalCountScores =
    data?.find((item) => item.total_count !== undefined)?.total_count ?? 0;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      pathname + "?" + createQueryString("mode", activeMode.toString())
    );
  }, [activeMode, pathname, createQueryString]);

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<LucideHistory />}
        roundBottom={true}
      />
      <div>
        <PrettyHeader className="border-0">
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
          <div className="bg-card rounded-b-3xl mb-4">
            <RoundedContent className="min-h-0 h-fit max-h-none rounded-t-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {scores?.map((score) => (
                  <div key={`score-${score.id}`} className="mb-2">
                    <UserScoreMinimal score={score} />
                  </div>
                ))}
              </div>

              {scores.length < 100 && scores.length < totalCountScores && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleShowMore}
                    className="w-full md:w-1/2 flex items-center justify-center"
                    isLoading={isLoadingMore}
                    variant="secondary"
                  >
                    <ChevronDown />
                    {t("showMore")}
                  </Button>
                </div>
              )}
            </RoundedContent>
          </div>
        )}
      </div>
    </div>
  );
}
