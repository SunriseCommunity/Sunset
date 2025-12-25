import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import RoundedContent from "@/components/General/RoundedContent";
import ScoreStats from "@/components/ScoreStats";
import { Tooltip } from "@/components/Tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserHoverCard from "@/components/UserHoverCard";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse, ScoreResponse } from "@/lib/types/api";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";

export default function ScoreLeaderboardData({
  score,
  beatmap,
}: {
  score: ScoreResponse;
  beatmap: BeatmapResponse;
}) {
  return (
    <RoundedContent className="flex flex-col place-content-between items-center space-y-4 rounded-lg md:flex-row md:space-y-0">
      <div className="flex w-full max-w-72 items-center">
        <div className="flex flex-row items-center space-x-2">
          <div className="mx-4 flex flex-col">
            <p className="text-nowrap font-bold"># {score.leaderboard_rank}</p>
            <p
              className={`text-${getGradeColor(
                score.grade,
              )} text-shadow text-4xl font-bold`}
            >
              {score.grade}
            </p>
          </div>
          <Avatar className="size-16 border-2 border-white">
            <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
              <Image
                src={score.user.avatar_url}
                alt="logo"
                width={256}
                height={256}
              />
            </Suspense>
          </Avatar>
          <div className="flex flex-col items-start">
            <UserHoverCard user={score.user} asChild>
              <Link
                className="smooth-transition cursor-pointer font-bold hover:text-primary"
                href={`/user/${score.user.user_id}`}
              >
                {score.user.username}
              </Link>
            </UserHoverCard>
            <Tooltip content={toPrettyDate(score.when_played, true)}>
              <p className="text-xs text-muted-foreground">
                {timeSince(score.when_played, undefined)}
              </p>
            </Tooltip>
            <Image
              src={`/images/flags/${score.user.country_code}.png`}
              alt="User Flag"
              className="mr-2 min-w-3"
              width={18}
              height={18}
            />
          </div>
          <div className="block lg:hidden">
            <ScoreDropdownInfo score={score} />
          </div>
        </div>
      </div>

      <div className="flex">
        <ScoreStats score={score} beatmap={beatmap} variant="leaderboard" />
        <div className="hidden lg:block">
          <ScoreDropdownInfo score={score} />
        </div>
      </div>
    </RoundedContent>
  );
}

function ScoreDropdownInfo({ score }: { score: ScoreResponse }) {
  const t = useT("pages.beatmapsets.components.leaderboard.actions");
  const { self } = useSelf();
  const { downloadReplay } = useDownloadReplay(score.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">{t("openMenu")}</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/score/${score.id}`}>{t("viewDetails")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={downloadReplay}
          disabled={!self || !score.has_replay}
        >
          {t("downloadReplay")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
