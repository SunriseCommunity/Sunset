"use client";

import Spinner from "@/components/Spinner";
import { useState, use } from "react";
import Image from "next/image";
import { Edit3Icon, User as UserIcon } from "lucide-react";
import UserBadges from "@/app/user/[id]/components/UserBadges";
import PrettyHeader from "@/components/General/PrettyHeader";
import UserTabGeneral from "@/app/user/[id]/components/Tabs/UserTabGeneral";
import { twMerge } from "tailwind-merge";
import UserTabMedals from "./components/Tabs/UserTabMedals";
import ImageWithFallback from "@/components/ImageWithFallback";
import UserTabBeatmaps from "./components/Tabs/UserTabBeatmaps";
import GameModeSelector from "@/components/GameModeSelector";
import RoundedContent from "@/components/General/RoundedContent";
import { User, UserScoresType, UserStats } from "@/lib/hooks/api/user/types";
import {
  useUser,
  useUserSelf,
  useUserStats,
} from "@/lib/hooks/api/user/useUser";
import UserTabScores from "@/app/user/[id]/components/Tabs/UserTabScores";
import { GameMode } from "@/lib/hooks/api/types";
import { FriendshipButton } from "@/components/FriendshipButton";
import { Button } from "@/components/ui/button";
import UserRankColor from "@/components/UserRankNumber";
import { useRouter } from "next/navigation";
import UserStatusText, {
  statusColor,
} from "@/app/user/[id]/components/UserStatusText";
import UserRanks from "@/app/user/[id]/components/UserRanks";
import { Tooltip } from "@/components/Tooltip";

const contentTabs = [
  "General",
  "Best scores",
  "Recent scores",
  "First places",
  "Beatmaps",
  "Medals",
];

const renderTabContent = (
  userStats: UserStats | undefined,
  activeTab: string,
  activeMode: GameMode,
  user: User
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
          type={UserScoresType.best}
        />
      );
    case "Recent scores":
      return (
        <UserTabScores
          key={`recent-${activeMode}`}
          gameMode={activeMode}
          userId={user.user_id}
          type={UserScoresType.recent}
        />
      );
    case "First places":
      return (
        <UserTabScores
          key={`first-${activeMode}`}
          gameMode={activeMode}
          userId={user.user_id}
          type={UserScoresType.top}
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
  const router = useRouter();
  const params = use(props.params);
  const userId = params.id;

  const [activeTab, setActiveTab] = useState("General");
  const [activeMode, setActiveMode] = useState(GameMode.std);

  const self = useUserSelf();

  const userQuery = useUser(userId);
  const userStatsQuery = useUserStats(userId, activeMode);

  if (userQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );
  }

  const errorMessage = userStatsQuery.error?.message ?? "User not found";

  const user = userQuery.data;
  const userStats = userStatsQuery.data?.stats;

  return (
    <div className="flex flex-col w-full mt-8">
      <PrettyHeader
        icon={<UserIcon />}
        text="Player info"
        className="mb-4"
        roundBottom={true}
      />

      <PrettyHeader className="border-b-0">
        <GameModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </PrettyHeader>

      <RoundedContent className="rounded-lg-b p-0 border-t-0 bg-card">
        {!userStatsQuery.error && user ? (
          <>
            <div className="lg:h-64 md:h-44 h-32 relative">
              <ImageWithFallback
                src={`${user?.banner_url}&default=false`}
                alt=""
                fill={true}
                objectFit="cover"
                className="bg-secondary rounded-t-lg"
                fallBackSrc="/images/placeholder.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent flex w-full">
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
                      <Tooltip
                        className="flex flex-row flex-grow min-w-0"
                        content={user.username}
                      >
                        <UserRankColor
                          className="md:text-3xl ml-full text-lg font-bold truncate"
                          variant="primary"
                          rank={userStats?.rank ?? -1}
                        >
                          {user.username}
                        </UserRankColor>
                      </Tooltip>
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
                  <UserBadges badges={user.badges} />
                </div>
                <div className="flex space-x-2">
                  {user.user_id === self.data?.user_id ? (
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
                </div>
              </div>

              <div className="my-4">
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
              <h1 className="text-4xl">
                {errorMessage ?? "User not found or an error occurred."}
              </h1>
              {errorMessage?.includes("restrict") ? (
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
  );
}
