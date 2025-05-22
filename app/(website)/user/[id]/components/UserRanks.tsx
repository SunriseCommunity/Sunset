import PrettyDate from "@/components/General/PrettyDate";
import { Tooltip } from "@/components/Tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import UserRankColor from "@/components/UserRankNumber";
import { UserResponse, UserStatsResponse } from "@/lib/types/api";
import toPrettyDate from "@/lib/utils/toPrettyDate";
import { Globe } from "lucide-react";
import { JSX } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: UserResponse;
  userStats: UserStatsResponse | undefined;
}

export default function UserRanks({ user, userStats, ...props }: Props) {
  return (
    <div className="flex flex-col space-y-2 bg-black bg-opacity-75 px-2 py-1 rounded text-center md:min-w-24">
      <UserRank
        rank={userStats?.rank}
        bestRank={userStats?.best_global_rank}
        bestRankDate={userStats?.best_global_rank_date}
        variant="primary"
        Icon={<Globe className="md:w-6 md:h-6 w-5 h-5 mr-2" />}
      />

      <UserRank
        rank={userStats?.country_rank}
        bestRank={userStats?.best_country_rank}
        bestRankDate={userStats?.best_country_rank_date}
        variant="secondary"
        Icon={
          <img
            src={`/images/flags/${user.country_code}.png`}
            alt="Country Flag"
            className="md:w-6 md:h-6 w-5 h-5 mr-2"
          />
        }
      />
    </div>
  );
}

function UserRank({
  rank,
  bestRank,
  bestRankDate,
  variant,
  Icon,
}: {
  rank: number | undefined;
  bestRank: number | undefined;
  bestRankDate: string | undefined;
  variant: "primary" | "secondary";
  Icon: React.ReactNode;
}) {
  return (
    <Tooltip
      align="end"
      content={
        bestRankDate ? (
          <div className="text-xs w-32 md:text-sm md:w-fit ">
            Highest rank{" "}
            <UserRankColor
              className="inline"
              variant={variant}
              rank={bestRank ?? -1}
            >
              #{bestRank}
            </UserRankColor>{" "}
            on {toPrettyDate(bestRankDate)}
          </div>
        ) : (
          ""
        )
      }
    >
      <div className="flex flex-nowrap items-center text-white text-nowrap">
        {Icon}
        <UserRankColor
          className="flex flex-nowrap md:text-2xl font-bold"
          variant={variant}
          rank={rank ?? -1}
        >
          #{" "}
          {rank ?? <Skeleton className="w-3 h-5 ml-1 md:w-9 md:h-6 md:ml-2" />}
        </UserRankColor>
      </div>
    </Tooltip>
  );
}
