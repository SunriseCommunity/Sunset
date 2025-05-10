"use client";
import Spinner from "@/components/Spinner";
import { ChevronDown, Users2 } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";

import { useFriends } from "@/lib/hooks/api/user/useFriends";
import { Button } from "@/components/ui/button";
import { UsersList } from "@/app/friends/components/UsersList";
import { useEffect, useState } from "react";
import {
  UsersListSortingOptions,
  UsersListSortingType,
} from "@/app/friends/components/UsersListSortingOptions";
import {
  UsersListViewModeOptions,
  UsersListViewModeType,
} from "@/app/friends/components/UsersListViewModeOptions";
import { useFollowers } from "@/lib/hooks/api/user/useFollowers";
import { FollowersResponse, FriendsResponse } from "@/lib/types/api";

type UsersType = "friends" | "followers";

export default function Friends() {
  const [sortBy, setSortBy] = useState<UsersListSortingType>("lastActive");
  const [viewMode, setViewMode] = useState<UsersListViewModeType>("grid");

  useEffect(() => {
    const value = localStorage.getItem("preferedUsersViewMode");
    if (value === "grid" || value === "list") {
      setViewMode(value);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preferedUsersViewMode", viewMode);
  }, [viewMode]);

  const [usersType, setUsersType] = useState<UsersType>("friends");
  const isShowingFriends = usersType === "friends";

  const usersQuery = isShowingFriends ? useFriends(100) : useFollowers(100);
  const { data, isLoading, setSize, size } = usersQuery;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const handleShowMore = () => {
    setSize(size + 1);
  };

  const users =
    data?.flatMap((item) =>
      isShowingFriends
        ? (item as FriendsResponse).friends
        : (item as FollowersResponse).followers
    ) ?? [];

  const totalCount = data?.find(
    (item) => item.total_count !== undefined
  )?.total_count;

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === "username") {
      return a.username.localeCompare(b.username);
    } else {
      const dateA = new Date(a.last_online_time);
      const dateB = new Date(b.last_online_time);
      return dateB.getTime() - dateA.getTime();
    }
  });

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader
        text="Your Connections"
        icon={<Users2 />}
        roundBottom={true}
      ></PrettyHeader>
      <div>
        <PrettyHeader className="border-b-0 ">
          <div className="flex flex-col sm:flex-row justify-between  gap-2 items-center w-full">
            <div className="place-content-end gap-2 flex">
              <Button
                onClick={() => {
                  setUsersType("friends");
                }}
                variant={usersType == "friends" ? "default" : "secondary"}
              >
                Friends
              </Button>
              <Button
                onClick={() => {
                  setUsersType("followers");
                }}
                variant={usersType == "followers" ? "default" : "secondary"}
              >
                Followers
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <UsersListSortingOptions
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              <UsersListViewModeOptions
                viewMode={viewMode}
                onViewChange={setViewMode}
              />
            </div>
          </div>
        </PrettyHeader>

        <div className="rounded-b-3xl bg-card mb-4 border border-t-0 shadow">
          <RoundedContent className="rounded-t-xl border-none shadow-none">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="xl" />
              </div>
            ) : (
              <>
                <UsersList users={sortedUsers ?? []} viewMode={viewMode} />

                {(sortedUsers?.length ?? 0) < (totalCount ?? 0) && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={handleShowMore}
                      className="w-full md:w-1/2 flex items-center justify-center"
                      isLoading={isLoadingMore}
                    >
                      <ChevronDown />
                      Show more
                    </Button>
                  </div>
                )}
              </>
            )}
          </RoundedContent>
        </div>
      </div>
    </div>
  );
}
