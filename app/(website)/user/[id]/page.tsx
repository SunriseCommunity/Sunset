"use client";

import Spinner from "@/components/Spinner";
import { useState, use, useCallback, useEffect } from "react";
import Image from "next/image";
import { Edit3Icon, LucideSettings, User as UserIcon } from "lucide-react";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import PrettyHeader from "@/components/General/PrettyHeader";
import UserTabGeneral from "@/app/(website)/user/[id]/components/Tabs/UserTabGeneral";
import { twMerge } from "tailwind-merge";
import UserTabMedals from "./components/Tabs/UserTabMedals";
import ImageWithFallback from "@/components/ImageWithFallback";
import UserTabBeatmaps from "./components/Tabs/UserTabBeatmaps";
import GameModeSelector from "@/components/GameModeSelector";
import RoundedContent from "@/components/General/RoundedContent";
import {
  useUser,
  useUserSelf,
  useUserStats,
} from "@/lib/hooks/api/user/useUser";
import UserTabScores from "@/app/(website)/user/[id]/components/Tabs/UserTabScores";
import { FriendshipButton } from "@/components/FriendshipButton";
import { Button } from "@/components/ui/button";
import UserRankColor from "@/components/UserRankNumber";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import UserRanks from "@/app/(website)/user/[id]/components/UserRanks";
import { Tooltip } from "@/components/Tooltip";
import {
  GameMode,
  ScoreTableType,
  UserResponse,
  UserStatsResponse,
} from "@/lib/types/api";
import { isInstance } from "@/lib/utils/type.util";
import { SetDefaultGamemodeButton } from "@/app/(website)/user/[id]/components/SetDefaultGamemodeButton";
import useSelf from "@/lib/hooks/useSelf";
import UserGeneralInformation from "@/app/(website)/user/[id]/components/UserGeneralInformation";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import UserSocials from "@/app/(website)/user/[id]/components/UserSocials";
import UserPreviousUsernamesTooltip from "@/app/(website)/user/[id]/components/UserPreviousUsernamesTooltip";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

const contentTabs = [
  "General",
  "Best scores",
  "Recent scores",
  "First places",
  "Beatmaps",
  "Medals",
];

const renderTabContent = (
  userStats: UserStatsResponse | undefined,
  activeTab: string,
  activeMode: GameMode,
  user: UserResponse
) => {
  switch (activeTab) {
    case "General":
      return (
        <UserTabGeneral
          key={`general-${activeMode}`}
          user={user}
          stats={userStats}
          gameMode={activeMode}
        />
      );
    case "Best scores":
      return (
        <UserTabScores
          key={`best-${activeMode}`}
          gameMode={activeMode}
          userId={user.user_id}
          type={ScoreTableType.BEST}
        />
      );
    case "Recent scores":
      return (
        <UserTabScores
          key={`recent-${activeMode}`}
          gameMode={activeMode}
          userId={user.user_id}
          type={ScoreTableType.RECENT}
        />
      );
    case "First places":
      return (
        <UserTabScores
          key={`first-${activeMode}`}
          gameMode={activeMode}
          userId={user.user_id}
          type={ScoreTableType.TOP}
        />
      );
    case "Beatmaps":
      return (
        <UserTabBeatmaps
          key={`beatmaps-${activeMode}`}
          userId={user.user_id}
          gameMode={activeMode}
        />
      );
    case "Medals":
      return (
        <UserTabMedals
          key={`medals-${activeMode}`}
          user={user}
          gameMode={activeMode}
        />
      );
  }
};

export default function UserPage(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const userId = Number(params.id);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") ?? "";

  const [activeTab, setActiveTab] = useState("General");
  const [activeMode, setActiveMode] = useState<GameMode | null>(
    isInstance(mode, GameMode) ? (mode as GameMode) : null
  );

  const { self } = useSelf();

  const userQuery = userId === self?.user_id ? useUserSelf() : useUser(userId);
  const userStatsQuery = useUserStats(userId, activeMode);
  const userMetadataQuery = useUserMetadata(userId);

  useEffect(() => {
    if (!activeMode) return;

    window.history.replaceState(
      null,
      "",
      pathname + "?" + createQueryString("mode", activeMode.toString())
    );
  }, [activeMode]);

  useEffect(() => {
    if (activeMode || !userQuery.data) return;

    setActiveMode(userQuery.data.default_gamemode);
  }, [userQuery]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  if (userQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );
  }

  const errorMessage =
    userQuery.error?.message ?? "User not found or an error occurred.";

  const user = userQuery.data;
  const userStats = userStatsQuery.data?.stats;
  const userMetada = userMetadataQuery.data;

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader icon={<UserIcon />} text="Player info" roundBottom={true}>
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

        <RoundedContent className="rounded-lg-b p-0 border-t-0 bg-card">
          {!userStatsQuery.error && user && activeMode ? (
            <>
              <div className="lg:h-64 md:h-44 h-32 relative">
                <ImageWithFallback
                  src={`${user?.banner_url}&default=false`}
                  alt=""
                  fill={true}
                  objectFit="cover"
                  className="bg-black rounded-t-lg"
                  fallBackSrc="/images/placeholder.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20  to-transparent flex w-full">
                  <div className="relative overflow-hidden px-4 py-2 md:p-6 flex items-end place-content-between flex-grow">
                    <div className="flex items-end space-x-4 w-3/4 ">
                      <div className="relative w-16 h-16 md:w-32 md:h-32 flex-none">
                        <Image
                          src={user.avatar_url}
                          alt="User avatar"
                          fill={true}
                          objectFit="cover"
                          className={`rounded-full md:w-32 md:h-32 border-2 md:border-4 border-secondary`}
                        />
                        <div
                          className={twMerge(
                            "absolute bottom-1 right-1 w-5 h-5 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-secondary",
                            `bg-${statusColor(user.user_status)}`
                          )}
                        />
                      </div>
                      <div className="flex flex-col flex-grow min-w-0">
                        <div className="flex flex-row flex-wrap gap-x-2">
                          <Tooltip
                            className="flex flex-row min-w-0 space-x-2"
                            content={user.username}
                            align="start"
                          >
                            <UserRankColor
                              className="md:text-3xl ml-full text-lg font-bold truncate mt-0.5"
                              variant="primary"
                              rank={userStats?.rank ?? -1}
                            >
                              {user.username}
                            </UserRankColor>
                          </Tooltip>

                          <UserPreviousUsernamesTooltip
                            user={user}
                            className="place-self-start -ml-1"
                          />

                          <div className="gap-y-2">
                            <UserPrivilegeBadges
                              badges={[...user.badges]}
                              small={true}
                            />
                          </div>
                        </div>

                        <UserStatusText
                          className="text-xs grid md:flex md:text-base"
                          user={user}
                        />
                      </div>
                    </div>
                    <UserRanks user={user} userStats={userStats} />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-card">
                <div className="flex justify-between items-start">
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
                        <span className="hidden md:inline">Edit profile</span>
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
                        className="border-0 w-9"
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

                <hr className="my-2"></hr>
                <div className="my-2">
                  <div className="flex border-b border-gray overflow-x-auto">
                    {contentTabs.map((tab) => (
                      <button
                        key={tab}
                        className={`text-xs md:text-base py-2 px-4 text-nowrap border-primary/85 ${
                          activeTab === tab
                            ? "text-primary/85 border-b-2"
                            : "text-current hover:text-primary/85 hover:border-b-2"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {renderTabContent(userStats, activeTab, activeMode, user)}
              </div>
            </>
          ) : (
            <RoundedContent className="rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
              <div className="flex flex-col space-y-2">
                <h1 className="text-4xl">{errorMessage}</h1>
                {errorMessage.includes("restrict") ? (
                  <p>
                    This means that the user violated the server rules and has
                    been restricted.
                  </p>
                ) : (
                  <p>The user may have been deleted or does not exist.</p>
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
