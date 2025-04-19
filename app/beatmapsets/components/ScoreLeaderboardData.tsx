import RoundedContent from "@/components/General/RoundedContent";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Score } from "@/lib/hooks/api/score/types";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "@/components/Tooltip";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import ScoreStats from "@/components/ScoreStats";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import useSelf from "@/lib/hooks/useSelf";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";

export default function ScoreLeaderboardData({
  score,
  beatmap,
}: {
  score: Score;
  beatmap: Beatmap;
}) {
  const { self } = useSelf();
  const { downloadReplay } = useDownloadReplay(score.id);

  return (
    <RoundedContent className="flex flex-col md:flex-row rounded-lg items-center place-content-between space-y-4 md:space-y-0">
      <div>
        <div className="flex flex-row items-center space-x-2">
          <div className="flex flex-col mx-4">
            <p className="font-bold"># {score.leaderboard_rank}</p>
            <p
              className={`text-${getGradeColor(
                score.grade
              )} font-bold text-4xl`}
            >
              {score.grade}
            </p>
          </div>
          <Avatar className="border-2 border-white h-16 w-16">
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
            <Link
              className="cursor-pointer font-bold hover:text-primary smooth-transition"
              href={`/user/${score.user.user_id}`}
            >
              {score.user.username}
            </Link>
            <Tooltip content={toPrettyDate(score.when_played, true)}>
              <p className="text-muted-foreground text-xs">
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
        </div>
      </div>

      <div className="flex">
        <ScoreStats score={score} beatmap={beatmap} variant="leaderboard" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/score/${score.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={downloadReplay}
              disabled={!self || !score.has_replay}
            >
              Download Replay
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </RoundedContent>
  );
}
