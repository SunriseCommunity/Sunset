import { Globe } from "lucide-react";

import { Tooltip } from "@/components/Tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import UserRankColor from "@/components/UserRankNumber";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse, UserStatsResponse } from "@/lib/types/api";
import toPrettyDate from "@/lib/utils/toPrettyDate";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: UserResponse;
  userStats: UserStatsResponse | undefined;
}

export default function UserRanks({ user, userStats, ...props }: Props) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-black bg-opacity-75 px-3 py-1.5 text-sm md:text-base" {...props}>
      <UserRank
        rank={userStats?.rank}
        bestRank={userStats?.best_global_rank}
        bestRankDate={userStats?.best_global_rank_date}
        variant="primary"
        Icon={<Globe className="mr-1.5 size-4 md:mr-2 md:size-6" />}
      />

      <UserRank
        rank={userStats?.country_rank}
        bestRank={userStats?.best_country_rank}
        bestRankDate={userStats?.best_country_rank_date}
        variant="secondary"
        Icon={(
          <img
            src={`/images/flags/${user.country_code}.png`}
            alt="Country Flag"
            className="mr-1.5 size-4 md:mr-2 md:size-6"
          />
        )}
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
  const t = useT("pages.user.components.ranks");
  return (
    <Tooltip
      align="end"
      content={
        bestRankDate ? (
          <div className="w-32 text-xs md:w-fit md:text-sm ">
            {t.rich("highestRank", {
              rank: bestRank ?? 0,
              date: toPrettyDate(bestRankDate),
              rankValue: chunks => (
                <UserRankColor
                  className="inline"
                  variant={variant}
                  rank={bestRank ?? -1}
                >
                  #{chunks}
                </UserRankColor>
              ),
            })}
          </div>
        ) : (
          ""
        )
      }
    >
      <div className="flex flex-nowrap items-center text-nowrap text-white">
        {Icon}
        <UserRankColor
          className="flex flex-nowrap font-bold md:text-2xl"
          variant={variant}
          rank={rank ?? -1}
        >
          #
          {" "}
          {rank ?? <Skeleton className="ml-1 h-5 w-3 md:ml-2 md:h-6 md:w-9" />}
        </UserRankColor>
      </div>
    </Tooltip>
  );
}
