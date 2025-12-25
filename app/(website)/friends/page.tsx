"use client";
import { ChevronDown, Users2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { UsersList } from "@/app/(website)/friends/components/UsersList";
import type {
  UsersListSortingType,
} from "@/app/(website)/friends/components/UsersListSortingOptions";
import {
  UsersListSortingOptions,
} from "@/app/(website)/friends/components/UsersListSortingOptions";
import type {
  UsersListViewModeType,
} from "@/app/(website)/friends/components/UsersListViewModeOptions";
import {
  UsersListViewModeOptions,
} from "@/app/(website)/friends/components/UsersListViewModeOptions";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useFollowers } from "@/lib/hooks/api/user/useFollowers";
import { useFriends } from "@/lib/hooks/api/user/useFriends";
import { useT } from "@/lib/i18n/utils";
import type {
  FollowersResponse,
  FriendsResponse,
  UserResponse,
} from "@/lib/types/api";

type UsersType = "friends" | "followers";

export default function Friends() {
  const t = useT("pages.friends");
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

  // eslint-disable-next-line react-hooks/rules-of-hooks -- conditional hook
  const usersQuery = isShowingFriends ? useFriends(100) : useFollowers(100);
  const { data, isLoading, setSize, size } = usersQuery;

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);
  const handleShowMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  const totalCount = data?.find(
    item => item.total_count !== undefined,
  )?.total_count;

  const sortedUsers = useMemo(() => {
    const users
      = data?.flatMap(item =>
        isShowingFriends
          ? (item as FriendsResponse).friends
          : (item as FollowersResponse).followers,
      ) ?? [];

    return [...users].sort((a, b) => {
      if (sortBy === "username") {
        return a.username.localeCompare(b.username);
      }

      const getDateSortValue = (user: UserResponse) => {
        const time = new Date(user.last_online_time).getTime();
        const isOffline = user.user_status === "Offline";

        // Offline users get a penalty in priority
        return isOffline ? time - 1e12 : time;
      };

      return getDateSortValue(b) - getDateSortValue(a);
    });
  }, [data, isShowingFriends, sortBy]);

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<Users2 />}
        roundBottom={true}
      />
      <div>
        <PrettyHeader className="border-b-0 ">
          <div className="flex w-full flex-col items-center  justify-between gap-2 sm:flex-row">
            <div className="flex place-content-end gap-2">
              <Button
                onClick={() => {
                  setUsersType("friends");
                }}
                variant={usersType === "friends" ? "default" : "secondary"}
              >
                {t("tabs.friends")}
              </Button>
              <Button
                onClick={() => {
                  setUsersType("followers");
                }}
                variant={usersType === "followers" ? "default" : "secondary"}
              >
                {t("tabs.followers")}
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

        <div className="mb-4 rounded-b-3xl border border-t-0 bg-card shadow">
          <RoundedContent className="rounded-t-xl border-none shadow-none">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="xl" />
              </div>
            ) : (
              <>
                <UsersList users={sortedUsers ?? []} viewMode={viewMode} />

                {(sortedUsers?.length ?? 0) < (totalCount ?? 0) && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      onClick={handleShowMore}
                      className="flex w-full items-center justify-center md:w-1/2"
                      isLoading={isLoadingMore}
                    >
                      <ChevronDown />
                      {t("showMore")}
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
