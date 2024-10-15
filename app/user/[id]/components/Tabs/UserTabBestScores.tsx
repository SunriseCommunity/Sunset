import UserScoreOverview from "@/app/user/[id]/components/UserScoreOverview";
import { ContentNotExist } from "@/components/ContentNotExist";
import PrettyButton from "@/components/General/PrettyButton";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { getUserScores } from "@/lib/actions/getUserScores";
import { GameMode } from "@/lib/types/GameMode";
import { Score } from "@/lib/types/Score";
import { ChartColumnIncreasing, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface UserTabGeneralProps {
  userId: number;
  gameMode: GameMode;
}

export default function UserTabBestScores({
  userId,
  gameMode,
}: UserTabGeneralProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scoresObject, setScoresObject] = useState<{
    scores: Score[];
    total_count: number;
  }>({ scores: [], total_count: -1 });
  const [page, setPage] = useState(0);

  const pageLimit = 5;

  useEffect(() => {
    if (isLoading) return;

    setIsLoading(true);

    getUserScores(userId, gameMode, "best", page, pageLimit).then((res) => {
      if (res.error) {
        setIsLoading(false);
        return;
      }

      setScoresObject({
        scores: [...scoresObject.scores, ...res.data!.scores],
        total_count: res.data!.total_count,
      });

      setIsLoading(false);
    });
  }, [page]);

  const handleShowMore = () => {
    setPage(page + 1);
  };

  const { scores, total_count } = scoresObject;

  return (
    <div className="flex flex-col">
      <PrettyHeader
        text="Best scores"
        icon={<ChartColumnIncreasing />}
        counter={total_count > 0 ? total_count : undefined}
      />
      <RoundedContent className="min-h-60 h-fit max-h-none">
        {scores.length === 0 &&
          (isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : (
            <ContentNotExist text="User has no best scores" />
          ))}
        {scores.map((score) => (
          <div key={`score-${score.id}`} className="mb-2">
            <UserScoreOverview score={score} />
          </div>
        ))}
        {scores.length < total_count && (
          <div className="flex justify-center mt-4">
            <PrettyButton
              text="Show more"
              onClick={handleShowMore}
              icon={<ChevronDown />}
              className="w-full md:w-1/2 flex items-center justify-center"
              isLoading={isLoading}
            />
          </div>
        )}
      </RoundedContent>
    </div>
  );
}
