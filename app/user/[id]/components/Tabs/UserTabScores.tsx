import UserScoreOverview from "@/app/user/[id]/components/UserScoreOverview";
import { ContentNotExist } from "@/components/ContentNotExist";
import PrettyButton from "@/components/General/PrettyButton";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { GameMode } from "@/lib/hooks/api/types";
import { UserScoresType } from "@/lib/hooks/api/user/types";
import { useUserScores } from "@/lib/hooks/api/user/useUserScores";
import { ChartColumnIncreasing, ChevronDown } from "lucide-react";

interface UserTabScoresProps {
  userId: number;
  gameMode: GameMode;
  type: UserScoresType;
}

export default function UserTabScores({
  userId,
  gameMode,
  type,
}: UserTabScoresProps) {
  const { data, setSize, size, isLoading, isValidating } = useUserScores(
    userId,
    gameMode,
    type,
    5
  );

  const handleShowMore = () => {
    setSize(size + 1);
  };

  const scores = data?.flatMap((item) => item.scores);
  const total_count = data?.find(
    (item) => item.total_count !== undefined
  )?.total_count;

  return (
    <div className="flex flex-col">
      <PrettyHeader
        text={`${UserScoresType[type]} scores`}
        icon={<ChartColumnIncreasing />}
        counter={
          data && data.length > 0 && data[0].total_count > 0
            ? data[0].total_count
            : undefined
        }
      />
      <RoundedContent className="min-h-60 h-fit max-h-none">
        {!data && (
          <div className="flex justify-center items-center h-32">
            <Spinner />
          </div>
        )}

        {data && scores && total_count && (
          <div>
            {scores.length <= 0 && (
              <ContentNotExist text="User has no best scores" />
            )}
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
                  isLoading={isLoading || isValidating}
                />
              </div>
            )}
          </div>
        )}
      </RoundedContent>
    </div>
  );
}
