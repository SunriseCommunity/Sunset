import { LucideMedal } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import PrettyDate from "@/components/General/PrettyDate";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { Tooltip } from "@/components/Tooltip";
import { useUserMedals } from "@/lib/hooks/api/user/useUserMedals";
import { useT } from "@/lib/i18n/utils";
import type {
  GameMode,
  GetUserByIdMedalsResponse,
  UserMedalResponse,
  UserResponse,
} from "@/lib/types/api";

interface UserTabMedalsProps {
  user: UserResponse;
  gameMode: GameMode;
}

export default function UserTabMedals({ user, gameMode }: UserTabMedalsProps) {
  const t = useT("pages.user.components.medalsTab");
  const userMedalsQuery = useUserMedals(user.user_id, gameMode);
  const userMedals = userMedalsQuery.data;

  const medalsNames = useMemo(
    () => ({
      hush_hush: t("categories.hushHush"),
      beatmap_hunt: t("categories.beatmapHunt"),
      mod_introduction: t("categories.modIntroduction"),
      skill: t("categories.skill"),
    }),
    [t],
  );

  const latestMedals = userMedals
    ? Object.values(userMedals)
        .flatMap(group => group.medals as UserMedalResponse[])
        .filter(m => m.unlocked_at)
        .sort(
          (a, b) =>
            new Date(b.unlocked_at!).getTime()
              - new Date(a.unlocked_at!).getTime(),
        )
    : [];

  return (
    <div className="flex flex-col">
      <PrettyHeader text={t("medals")} icon={<LucideMedal />} />

      <RoundedContent className="grid h-fit max-h-none min-h-0 gap-4 md:grid-cols-2">
        {latestMedals.length > 0 && (
          <div className="md:col-span-2">
            <PrettyHeader roundBottom className="px-4 py-1">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">{t("latest")}</h2>
              </div>
            </PrettyHeader>
            <RoundedContent className="">
              <div className="flex h-20 flex-row flex-wrap space-x-2 overflow-hidden">
                {latestMedals.map(medal => (
                  <div key={medal.id} className="mb-20">
                    {MedalElement(medal, t)}
                  </div>
                ))}
              </div>
            </RoundedContent>
          </div>
        )}
        {Object.keys(medalsNames).map(category => (
          <div key={category}>
            <PrettyHeader roundBottom className="px-4 py-1">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">
                  {medalsNames[category as keyof typeof medalsNames]}
                </h2>
              </div>
            </PrettyHeader>

            <div className="grid grid-cols-4 items-center justify-center gap-4 rounded-b-lg p-4">
              {userMedals ? (
                userMedals[
                  category as keyof GetUserByIdMedalsResponse
                ].medals.map(medal => MedalElement(medal, t))
              ) : (
                <div className="col-span-4 mx-auto">
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

function MedalElement(medal: UserMedalResponse, t: ReturnType<typeof useT>) {
  const isAchieved = medal.unlocked_at !== null;

  return (
    <div
      className="flex flex-col items-center"
      key={`medal-element-${medal.id}`}
    >
      <Tooltip
        key={medal.id}
        content={(
          <div className="flex min-w-52 flex-col items-center text-center">
            <h2 className="mx-auto mb-2 text-wrap text-xl font-semibold text-primary">
              {medal.name}
            </h2>

            <div className="mx-auto mb-2 max-w-52 break-normal text-center text-sm text-current">
              {medal.description}
            </div>

            <div
              className={twMerge(
                "text-xs",
                isAchieved ? "text-current" : "text-gray-500",
              )}
            >
              {isAchieved ? (
                <div className="flex items-center">
                  <span>{t("achievedOn")}&nbsp;</span>
                  <PrettyDate time={medal.unlocked_at!} withTime={false} />
                </div>
              ) : (
                t("notAchieved")
              )}
            </div>
          </div>
        )}
      >
        <Image
          src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/medals/client/${medal.id}@2x.png`}
          alt={medal.name}
          width={75}
          height={75}
          className={`rounded-full ${
            isAchieved ? "filter-none" : "opacity-50 grayscale filter"
          } center`}
        />
      </Tooltip>
    </div>
  );
}
