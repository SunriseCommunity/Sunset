"use client";

import { UserPlus, Users } from "lucide-react";
import { useState } from "react";

import Spinner from "@/components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserListItem } from "@/components/UserListElement";
import {
  useAdminUserFollowers,
  useAdminUserFriends,
} from "@/lib/hooks/api/user/useAdminUserEdit";
import type { UserSensitiveResponse } from "@/lib/types/api";

export default function AdminUserConnections({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const [activeTab, setActiveTab] = useState("followers");

  const { data: followersData, isLoading: isLoadingFollowers }
    = useAdminUserFollowers(user.user_id, 100, 1);

  const { data: followingData, isLoading: isLoadingFollowing }
    = useAdminUserFriends(user.user_id, 100, 1);

  // TODO: Pagination for followers/following lists

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5" />
          Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              <Users className="mr-1 size-4" />
              Followers
            </TabsTrigger>
            <TabsTrigger value="following">
              <UserPlus className="mr-1 size-4" />
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="mt-4">
            {isLoadingFollowers ? (
              <div className="flex items-center justify-center p-8">
                <Spinner />
              </div>
            ) : followersData && followersData.followers.length > 0
              ? (
                  <>
                    <div className="max-h-[400px] space-y-2 overflow-y-auto">
                      {followersData.followers.map(follower => (
                        <UserListItem
                          key={follower.user_id}
                          user={follower}
                          includeFriendshipButton={false}
                        />
                      ))}
                    </div>
                    <p className="pt-2 text-center text-xs text-muted-foreground">
                      Showing
                      {" "}
                      {followersData?.followers.length || 0}
                      /
                      {followersData?.total_count || 0}
                      {" "}
                      followers
                    </p>
                  </>
                )
              : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Users className="mx-auto mb-2 size-12 opacity-50" />
                    <p>No followers yet</p>
                  </div>
                )}
          </TabsContent>

          <TabsContent value="following" className="mt-4">
            {isLoadingFollowing ? (
              <div className="flex items-center justify-center p-8">
                <Spinner />
              </div>
            ) : followingData && followingData.friends.length > 0
              ? (
                  <>
                    <div className="max-h-[400px] space-y-2 overflow-y-auto">
                      {followingData.friends.map(friend => (
                        <UserListItem
                          key={friend.user_id}
                          user={friend}
                          includeFriendshipButton={false}
                        />
                      ))}
                    </div>
                    <p className="pt-2 text-center text-xs text-muted-foreground">
                      Showing
                      {" "}
                      {followingData?.friends.length || 0}
                      /
                      {followingData?.total_count || 0}
                      {" "}
                      following
                    </p>
                  </>
                )
              : (
                  <div className="p-8 text-center text-muted-foreground">
                    <UserPlus className="mx-auto mb-2 size-12 opacity-50" />
                    <p>Not following anyone yet</p>
                  </div>
                )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
