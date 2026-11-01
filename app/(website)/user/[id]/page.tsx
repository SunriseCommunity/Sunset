"use client";

import { Edit3Icon, LucideSettings, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { SetDefaultGamemodeButton } from "@/app/(website)/user/[id]/components/SetDefaultGamemodeButton";
import UserTabGeneral from "@/app/(website)/user/[id]/components/Tabs/UserTabGeneral";
import UserTabScores from "@/app/(website)/user/[id]/components/Tabs/UserTabScores";
import UserGeneralInformation from "@/app/(website)/user/[id]/components/UserGeneralInformation";
import { UserLevelProgress } from "@/app/(website)/user/[id]/components/UserLevelProgress";
import UserPreviousUsernamesTooltip from "@/app/(website)/user/[id]/components/UserPreviousUsernamesTooltip";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserProfileOverview from "@/app/(website)/user/[id]/components/UserProfileOverview";
import UserSocials from "@/app/(website)/user/[id]/components/UserSocials";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import { FriendshipButton } from "@/components/FriendshipButton";
import GameModeSelector from "@/components/GameModeSelector";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import Spinner from "@/components/Spinner";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import UserRankColor from "@/components/UserRankNumber";
import {
  useUser,
  useUserSelf,
  useUserStats,
} from "@/lib/hooks/api/user/useUser";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type {
  UserResponse,
} from "@/lib/types/api";
import {
  GameMode,
  ScoreTableType,
} from "@/lib/types/api";
import { createQueryString } from "@/lib/utils/buildQuery";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

import UserTabBeatmaps from "./components/Tabs/UserTabBeatmaps";
import UserTabMedals from "./components/Tabs/UserTabMedals";

export default function UserPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const userId = tryParseNumber(params.id) ?? 0;
  const t = useT("pages.user");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") ?? "";

  const contentTabs = [
    "tabs.general",
    "tabs.scores",
    "tabs.beatmaps",
    "tabs.medals",
  ];

  const [activeTab, setActiveTab] = useState("tabs.general");
  const [activeMode, setActiveMode] = useState<GameMode | null>(
    () => (isInstance(mode, GameMode) ? (mode as GameMode) : null),
  );

  const { self } = useSelf();

  // eslint-disable-next-line react-hooks/rules-of-hooks -- works fine
  const userQuery = userId === self?.user_id ? useUserSelf() : useUser(userId);
  const userStatsQuery = useUserStats(userId, activeMode);
  const userMetadataQuery = useUserMetadata(userId);

  const renderTabContent = useCallback(
    (activeTab: string, activeMode: GameMode, user: UserResponse) => {
      if (activeTab === "tabs.general") {
        return <UserTabGeneral key={`general-${activeMode}`} user={user} />;
      }
      if (activeTab === "tabs.scores") {
        return (
          <div className="flex flex-col gap-4">
            <UserTabScores
              key={`best-${activeMode}`}
              gameMode={activeMode}
              userId={user.user_id}
              type={ScoreTableType.BEST}
            />
            <UserTabScores
              key={`recent-${activeMode}`}
              gameMode={activeMode}
              userId={user.user_id}
              type={ScoreTableType.RECENT}
            />
            <UserTabScores
              key={`first-${activeMode}`}
              gameMode={activeMode}
              userId={user.user_id}
              type={ScoreTableType.TOP}
            />
          </div>
        );
      }
      if (activeTab === "tabs.beatmaps") {
        return (
          <UserTabBeatmaps
            key={`beatmaps-${activeMode}`}
            userId={user.user_id}
            gameMode={activeMode}
          />
        );
      }
      if (activeTab === "tabs.medals") {
        return (
          <UserTabMedals
            key={`medals-${activeMode}`}
            user={user}
            gameMode={activeMode}
          />
        );
      }
      return null;
    },
    [],
  );

  useEffect(() => {
    if (!activeMode)
      return;

    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("mode", activeMode.toString())}`,
    );
  }, [activeMode, pathname]);

  useEffect(() => {
    if (activeMode || !userQuery.data)
      return;

    setActiveMode(userQuery.data.default_gamemode);
  }, [userQuery, activeMode]);

  if (userQuery.isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  const errorMessage = userQuery.error?.message ?? t("errors.userNotFound");

  const user = userQuery.data;
  const userStats = userStatsQuery.data?.stats;
  const userMetada = userMetadataQuery.data;

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader icon={<UserIcon />} text={t("header")} roundBottom={true}>
        {user && activeMode && (
          <SetDefaultGamemodeButton gamemode={activeMode} user={user} />
        )}
      </PrettyHeader>

      <div>
        <PrettyHeader className="border-b-0">
          {user && activeMode && (
            <GameModeSelector
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              userDefaultGameMode={user?.default_gamemode}
            />
          )}
        </PrettyHeader>

        <RoundedContent className="rounded-lg-b border-t-0 bg-card p-0">
          {!userStatsQuery.error && user && activeMode ? (
            <>
              <div className="relative h-32 md:h-44 lg:h-64">
                <ImageWithFallback
                  src={`${user?.banner_url}&default=false`}
                  alt=""
                  fill={true}
                  objectFit="cover"
                  className="rounded-t-lg bg-black"
                  fallBackSrc="/images/placeholder.png"
                />
              </div>

              <div className="relative flex items-end justify-between gap-2 px-4 md:gap-4 md:px-6">
                <div className="flex min-w-0 flex-1 items-end gap-3 md:gap-4">
                  <div className="relative z-10 -mt-14 size-16 flex-none md:-mt-28 md:size-32">
                    <Image
                      src={user.avatar_url}
                      alt="User avatar"
                      fill={true}
                      objectFit="cover"
                      className="rounded-full border-2 border-secondary md:border-4"
                    />
                    <div
                      className={twMerge(
                        "absolute bottom-1 right-1 size-5 rounded-full border-2 border-secondary md:size-10 md:border-4",
                        `bg-${statusColor(user.user_status)}`,
                      )}
                    />
                  </div>
                  <div className="min-w-0 pb-2">
                    <div className="flex min-w-0 flex-row flex-wrap gap-x-2">
                      <Tooltip
                        className="flex min-w-0 flex-row space-x-2"
                        content={user.username}
                        align="start"
                      >
                        <UserRankColor
                          className="ml-full mt-0.5 truncate text-lg font-bold md:text-3xl"
                          variant="primary"
                          rank={userStats?.rank ?? -1}
                        >
                          {user.username}
                        </UserRankColor>
                      </Tooltip>

                      <UserPreviousUsernamesTooltip
                        user={user}
                        className="-ml-1 place-self-start"
                      />

                      <div className="gap-y-2">
                        <UserPrivilegeBadges
                          badges={[...user.badges]}
                          small={true}
                        />
                      </div>
                    </div>

                    <UserStatusText
                      className="grid text-xs md:flex md:text-base"
                      user={user}
                    />
                  </div>
                </div>
                <div className="mb-2 w-36 shrink-0 rounded bg-black/70 p-2 text-white md:w-56">
                  {userStats ? (
                    <UserLevelProgress totalScore={userStats.total_score} />
                  ) : (
                    <div className="h-10 animate-pulse rounded-md bg-white/15" />
                  )}
                </div>
              </div>

              <div className="bg-card p-4 md:px-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-wrap gap-2">
                    <UserGeneralInformation user={user} metadata={userMetada} />
                  </div>
                  <div className="flex space-x-2">
                    {user.user_id === self?.user_id ? (
                      <Button
                        onClick={() => router.push("/settings")}
                        className="w-9 md:w-auto"
                      >
                        <Edit3Icon />
                        <span className="hidden md:inline">
                          {t("buttons.editProfile")}
                        </span>
                      </Button>
                    ) : (
                      <>
                        <FriendshipButton userId={userId} />
                        {/* TODO: <Button onClick={() => {}} icon={<MessageSquare />} /> */}
                      </>
                    )}
                    {self && isUserHasAdminPrivilege(self) && (
                      <Button
                        variant="outline"
                        className="w-9 border-0"
                        onClick={() => {
                          router.push(`/admin/users/${user.user_id}/edit`);
                        }}
                      >
                        <LucideSettings />
                      </Button>
                    )}
                  </div>
                </div>

                {userMetada && <UserSocials metadata={userMetada} />}

                <div className="mt-4">
                  <UserProfileOverview
                    user={user}
                    stats={userStats}
                    gameMode={activeMode}
                  />
                </div>

                <hr className="my-2" />
                <div className="my-2">
                  <div className="border-gray flex overflow-x-auto border-b">
                    {contentTabs.map(tab => (
                      <button
                        key={tab}
                        className={`text-nowrap border-primary/85 px-4 py-2 text-xs md:text-base ${
                          activeTab === tab
                            ? "border-b-2 text-primary/85"
                            : "text-current hover:border-b-2 hover:text-primary/85"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {t(tab)}
                      </button>
                    ))}
                  </div>
                </div>

                {renderTabContent(activeTab, activeMode, user)}
              </div>
            </>
          ) : (
            <RoundedContent className="flex flex-col items-center justify-between gap-8 rounded-l md:flex-row md:items-start ">
              <div className="flex flex-col space-y-2">
                <h1 className="text-4xl">{errorMessage}</h1>
                {errorMessage.includes("restrict") ? (
                  <p>{t("errors.restricted")}</p>
                ) : (
                  <p>{t("errors.userDeleted")}</p>
                )}
              </div>
              <Image
                src="/images/user-not-found.png"
                alt="404"
                width={200}
                height={400}
                className="max-w-fit"
              />
            </RoundedContent>
          )}
        </RoundedContent>
      </div>
    </div>
  );
}
