"use client";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import Image from "next/image";
import {
  Edit3Icon,
  Globe,
  User as UserIcon,
  UserMinus,
  UserPlus,
} from "lucide-react";
import UserBadges from "@/app/user/[id]/components/UserBadges";
import PrettyHeader from "@/components/General/PrettyHeader";
import PrettyButton from "@/components/General/PrettyButton";
import UserTabGeneral from "@/app/user/[id]/components/Tabs/UserTabGeneral";
import UserTabWIP from "@/app/user/[id]/components/Tabs/UserTabWIP";
import { Tooltip } from "@/components/Tooltip";
import SkeletonLoading from "@/components/SkeletonLoading";
import PrettyDate from "@/components/General/PrettyDate";
import { twMerge } from "tailwind-merge";
import UserTabMedals from "./components/Tabs/UserTabMedals";
import toPrettyDate from "@/lib/utils/toPrettyDate";
import ImageWithFallback from "@/components/ImageWithFallback";
import UserTabBeatmaps from "./components/Tabs/UserTabBeatmaps";
import GameModeSelector from "@/components/GameModeSelector";
import RoundedContent from "@/components/General/RoundedContent";
import { User, UserScoresType, UserStats } from "@/lib/hooks/api/user/types";
import {
  useUserSelf,
  useUser,
  useUserStats,
} from "@/lib/hooks/api/user/useUser";
import {
  useUserFriendshipStatus,
  useUpdateUserFriendshipStatus,
} from "@/lib/hooks/api/user/useUserFriendshipStatus";
import UserTabScores from "@/app/user/[id]/components/Tabs/UserTabScores";
import { GameMode } from "@/lib/hooks/api/types";

const contentTabs = [
  "General",
  "Best scores",
  "Recent scores",
  "First places",
  "Beatmaps",
  "Medals",
];

const navigateTo = (href: string) => {
  window.location.href = href;
};

const statusColor = (user: User) =>
  user.user_status.trim() === "Offline"
    ? "text-[#b8b8b8]"
    : user.user_status.trim() === "Idle" || user.user_status.trim() === "Afk"
    ? "text-orange-400"
    : "text-green-500";

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
    default:
      return <UserTabWIP tabName={activeTab} />;
  }
};

export default function UserPage({ params }: { params: { id: number } }) {
  const userId = params.id;

  const [activeTab, setActiveTab] = useState("General");
  const [activeMode, setActiveMode] = useState(GameMode.std);

  const self = useUserSelf();

  const userQuery = useUser(userId);
  const userStatsQuery = useUserStats(userId, activeMode);
  const userFriendshipStatusQuery = useUserFriendshipStatus(userId);

  const { trigger } = useUpdateUserFriendshipStatus(userId);

  const updateFriendshipStatus = async (action: "add" | "remove") => {
    trigger(
      { action },
      {
        optimisticData: userFriendshipStatusQuery.data && {
          ...userFriendshipStatusQuery.data,
          is_followed_by_you: action === "add",
        },
      }
    );
  };

  const renderFriendshipButton = () => {
    if (!self.data || !userFriendshipStatus) return;

    const { is_followed_by_you, is_following_you } = userFriendshipStatus;
    const isMutual = is_followed_by_you && is_following_you;

    return (
      <PrettyButton
        onClick={() =>
          updateFriendshipStatus(
            userFriendshipStatus.is_followed_by_you ? "remove" : "add"
          )
        }
        icon={
          userFriendshipStatus.is_followed_by_you ? <UserMinus /> : <UserPlus />
        }
        className={
          isMutual
            ? "bg-pink-700 text-white hover:bg-pink-500"
            : is_followed_by_you
            ? "bg-lime-700 text-white hover:bg-lime-500"
            : ""
        }
        text={
          isMutual ? "Unfriend" : is_followed_by_you ? "Unfollow" : "Follow"
        }
      />
    );
  };

  if (userQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );
  }

  if (userQuery.error || userStatsQuery.error) {
    const errorMessage = userQuery.error ?? userStatsQuery.error;

    return (
      <main className="container mx-auto my-8">
        <PrettyHeader
          icon={<UserIcon />}
          text="Player info"
          className="bg-terracotta-700 mb-4"
          roundBottom={true}
        ></PrettyHeader>

        <RoundedContent className="bg-terracotta-700 rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl">
              {errorMessage ?? "User not found or an error occurred."}
            </h1>
            {errorMessage?.includes("restrict") ? (
              <p>
                This means that the user violated the server rules and has been
                restricted.
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
      </main>
    );
  }

  const user = userQuery.data!;
  const userStats = userStatsQuery.data?.stats;
  const userFriendshipStatus = userFriendshipStatusQuery.data;

  return (
    <main className="container mx-auto my-8">
      {/* Player info header */}

      <PrettyHeader
        icon={<UserIcon />}
        text="Player info"
        className="bg-terracotta-700 mb-4"
        roundBottom={true}
      ></PrettyHeader>

      <PrettyHeader text="" className="bg-terracotta-700 ">
        <GameModeSelector
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </PrettyHeader>

      <RoundedContent className="bg-terracotta-700 rounded-lg-b p-0">
        {/* Banner */}
        <div className="h-64 relative">
          <ImageWithFallback
            src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${
              user.user_id
            }?default=false&${Date.now()}`}
            alt=""
            fill={true}
            objectFit="cover"
            className="bg-stone-700 rounded-t-lg"
            fallBackSrc="/images/placeholder.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-terracotta-700 to-transparent flex items-end">
            <div className="p-6 flex items-end justify-between w-full">
              <div className="flex items-end space-x-4 w-3/4">
                <div className="relative w-32 h-32 flex-none">
                  <Image
                    src={`https://a.${
                      process.env.NEXT_PUBLIC_SERVER_DOMAIN
                    }/avatar/${user.user_id}?${Date.now()}`}
                    alt="User avatar"
                    fill={true}
                    objectFit="cover"
                    className={`w-32 h-32 rounded-full border-4 relative border-[#2a2a2a]`}
                  />
                </div>
                <div className="overflow-hidden flex-wrap">
                  <h1 className="text-3xl font-bold relative">
                    {user.username}
                  </h1>
                  <p
                    className={twMerge("flex items-center", statusColor(user))}
                  >
                    {user.user_status}
                    {user.user_status === "Offline" && (
                      <>
                        <p>, last seen on&nbsp;</p>
                        <PrettyDate time={user.last_online_time} />
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 bg-black bg-opacity-75 px-2 py-1 rounded mr-2 text-center min-w-24">
                <Tooltip
                  content={`Highest rank #${userStats?.best_global_rank} on ${
                    userStats?.best_global_rank_date &&
                    toPrettyDate(userStats?.best_global_rank_date)
                  }`}
                >
                  <div className="flex items-center text-white">
                    <Globe className="w-6 h-6 mr-2" />
                    <span
                      className={twMerge(
                        "text-2xl font-bold",
                        userStats?.rank === 1 && "text-yellow-400"
                      )}
                    >
                      #{" "}
                      {userStats?.rank ?? (
                        <SkeletonLoading className="w-9 h-6 ml-2" />
                      )}
                    </span>
                  </div>
                </Tooltip>

                <Tooltip
                  content={`Highest rank #${userStats?.best_country_rank} on ${
                    userStats?.best_country_rank_date &&
                    toPrettyDate(userStats?.best_country_rank_date)
                  }`}
                >
                  <div className="flex items-center text-white">
                    <img
                      src={`/images/flags/${user.country_code}.png`}
                      alt="Country Flag"
                      className="w-6 h-6 mr-2"
                    />
                    <span
                      className={twMerge(
                        "text-2xl font-bold",
                        userStats?.country_rank === 1 && "text-gray-300"
                      )}
                    >
                      #{" "}
                      {userStats?.country_rank ?? (
                        <SkeletonLoading className="w-9 h-6 ml-2" />
                      )}
                    </span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-2 pb-6">
          {/* User Info */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-wrap gap-2">
              <UserBadges badges={user.badges} />
            </div>
            <div className="flex space-x-2">
              {user.user_id === self.data?.user_id ? (
                <PrettyButton
                  onClick={navigateTo.bind(null, `/settings`)}
                  icon={<Edit3Icon />}
                  text="Edit profile"
                />
              ) : (
                <>
                  {renderFriendshipButton()}
                  {/* TODO: <PrettyButton onClick={() => {}} icon={<MessageSquare />} /> */}
                </>
              )}
            </div>
          </div>

          {/* Tab selector */}
          <div className="mb-6">
            <div className="flex border-b border-gray-700">
              {contentTabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 border-[#E0C097] ${
                    activeTab === tab
                      ? "text-[#E0C097] border-b-2"
                      : "text-gray-400 hover:text-[#E0C097] hover:border-b-2"
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
      </RoundedContent>
    </main>
  );
}
