import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { LucideMedal } from "lucide-react";
import Image from "next/image";
import PrettyDate from "@/components/General/PrettyDate";
import Spinner from "@/components/Spinner";
import { User, UserMedal, UserMedals } from "@/lib/hooks/api/user/types";
import { useUserMedals } from "@/lib/hooks/api/user/useUserMedals";
import { GameMode } from "@/lib/hooks/api/types";
import { Tooltip } from "@/components/Tooltip";
import { twMerge } from "tailwind-merge";

interface UserTabMedalsProps {
  user: User;
  gameMode: GameMode;
}

const MEDALS_NAMES: Record<string, string> = {
  hush_hush: "Hush hush",
  beatmap_hunt: "Beatmap hunt",
  mod_introduction: "Mod introduction",
  skill: "Skill",
};

export default function UserTabMedals({ user, gameMode }: UserTabMedalsProps) {
  const userMedalsQuery = useUserMedals(user.user_id, gameMode);
  const userMedals = userMedalsQuery.data;

  const latestMedals = userMedals
    ? Object.values(userMedals)
        .flatMap((group) => group.medals as UserMedal[])
        .filter((m) => m.unlocked_at)
        .sort(
          (a, b) =>
            new Date(b.unlocked_at!).getTime() -
            new Date(a.unlocked_at!).getTime()
        )
    : [];

  return (
    <div className="flex flex-col">
      <PrettyHeader text="Medals" icon={<LucideMedal />} />

      <RoundedContent className="min-h-0 h-fit max-h-none grid md:grid-cols-2 gap-4">
        {latestMedals.length > 0 && (
          <div className="md:col-span-2">
            <PrettyHeader roundBottom className="px-4 py-1">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">Latest</h2>
              </div>
            </PrettyHeader>
            <RoundedContent className="">
              <div className="flex flex-row overflow-hidden h-20 flex-wrap space-x-2">
                {latestMedals.map((medal) => (
                  <div key={medal.id} className="mb-20">
                    {MedalElement(medal)}
                  </div>
                ))}
              </div>
            </RoundedContent>
          </div>
        )}
        {Object.keys(MEDALS_NAMES).map((category) => (
          <div key={category}>
            <PrettyHeader roundBottom className="px-4 py-1">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">
                  {MEDALS_NAMES[category]}
                </h2>
              </div>
            </PrettyHeader>

            <div className="p-4 rounded-b-lg grid grid-cols-4 gap-4 justify-center items-center">
              {userMedals ? (
                userMedals[category as keyof UserMedals].medals.map((medal) =>
                  MedalElement(medal)
                )
              ) : (
                <div className="mx-auto col-span-4">
                  <Spinner size="lg" />
                </div>
              )}
            </div>
          </div>
        ))}
      </RoundedContent>
    </div>
  );
}

function MedalElement(medal: UserMedal) {
  const isAchieved = medal.unlocked_at !== null;

  return (
    <div
      className="flex flex-col items-center"
      key={`medal-element-${medal.id}`}
    >
      <Tooltip
        key={medal.id}
        content={
          <div className="flex flex-col items-center text-center min-w-52">
            <h2 className="text-xl font-semibold mx-auto text-wrap mb-2 text-primary">
              {medal.name}
            </h2>

            <div className="text-sm text-center max-w-52 mx-auto mb-2 break-normal text-current">
              {medal.description}
            </div>

            <div
              className={twMerge(
                "text-xs",
                isAchieved ? "text-current" : "text-gray-500"
              )}
            >
              {isAchieved ? (
                <div className="flex items-center">
                  <span>achieved on&nbsp;</span>
                  <PrettyDate time={medal.unlocked_at!} withTime={false} />
                </div>
              ) : (
                `Not achieved`
              )}
            </div>
          </div>
        }
      >
        <Image
          src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/medals/client/${medal.id}@2x.png`}
          alt={medal.name}
          width={75}
          height={75}
          className={`rounded-full ${
            isAchieved ? "filter-none" : "filter grayscale opacity-50"
          } center`}
        />
      </Tooltip>
    </div>
  );
}
