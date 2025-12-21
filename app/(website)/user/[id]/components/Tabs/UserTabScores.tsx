import UserScoreOverview from "@/app/(website)/user/[id]/components/UserScoreOverview";
import { ContentNotExist } from "@/components/ContentNotExist";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useUserScores } from "@/lib/hooks/api/user/useUserScores";
import { GameMode, ScoreTableType } from "@/lib/types/api";
import { ChartColumnIncreasing, ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n/utils";

interface UserTabScoresProps {
  userId: number;
  gameMode: GameMode;
  type: ScoreTableType;
}

export default function UserTabScores({
  userId,
  gameMode,
  type,
}: UserTabScoresProps) {
  const t = useT("pages.user.components.scoresTab");
  const { data, setSize, size, isLoading } = useUserScores(
    userId,
    gameMode,
    type,
    5
  );

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const handleShowMore = () => {
    setSize(size + 1);
  };

  const scores = data?.flatMap((item) => item.scores);
  let total_count = data?.find(
    (item) => item.total_count !== undefined
  )?.total_count;

  if (total_count && type === ScoreTableType.BEST) {
    total_count = Math.min(100, total_count);
  }

  const getHeaderText = () => {
    if (type === ScoreTableType.BEST) return t("bestScores");
    if (type === ScoreTableType.RECENT) return t("recentScores");
    if (type === ScoreTableType.TOP) return t("firstPlaces");
    return `${type} scores`;
  };

  const getNoScoresText = () => {
    if (type === ScoreTableType.BEST) return t("noScores", { type: "best" });
    if (type === ScoreTableType.RECENT)
      return t("noScores", { type: "recent" });
    if (type === ScoreTableType.TOP)
      return t("noScores", { type: "first places" });
  };

  return (
    <div className="flex flex-col">
      <PrettyHeader
        text={getHeaderText()}
        icon={<ChartColumnIncreasing />}
        counter={total_count && total_count > 0 ? total_count : undefined}
      />
      <RoundedContent className="min-h-60 h-fit max-h-none">
        {!data && (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        )}

        {data && scores && total_count != undefined && (
          <div>
            {scores.length <= 0 && <ContentNotExist text={getNoScoresText()} />}
            {scores.map((score) => (
              <div key={`score-${score.id}`} className="mb-2">
                <UserScoreOverview score={score} />
              </div>
            ))}
            {scores.length < total_count && (
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
          </div>
        )}
      </RoundedContent>
    </div>
  );
}
