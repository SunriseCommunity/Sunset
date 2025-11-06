"use client";

import { createContext } from "react";
import { UserSensitiveResponse } from "@/lib/types/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Clock } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "@/components/Tooltip";
import { timeSince } from "@/lib/utils/timeSince";
import AdminUserBasicInfo from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserBasicInfo";
import AdminUserImages from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserImages";
import AdminUserProfile from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserProfile";
import AdminUserConnections from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserConnections";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import AdminUserPrivilegeInput from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserPrivilegeInput";

export const SensitiveInfoContext = createContext<boolean>(false);

export default function AdminUserEditGeneral({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const isUserOffline = user.user_status === "Offline";

  return (
    <SensitiveInfoContext.Provider value={true}>
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="relative h-32 w-full">
            <ImageWithFallback
              src={user.banner_url}
              alt="User Banner"
              fill
              objectFit="cover"
              className="object-cover"
              fallBackSrc="/images/placeholder.png"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/90" />

            <div className="absolute -bottom-12 left-4 sm:left-8">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-card shadow-xl overflow-hidden">
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 pb-6 pt-16 sm:pt-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {user.username}
                  </h1>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    asChild
                  >
                    <Link href={`/user/${user.user_id}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ID: {user.user_id}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Tooltip
                  content={new Date(user.last_online_time).toLocaleString()}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        !isUserOffline
                          ? `bg-${statusColor(user.user_status)} animate-pulse`
                          : "bg-gray-500"
                      }`}
                    />

                    <UserStatusText
                      className={!isUserOffline ? "font-bold" : ""}
                      user={user}
                    />
                  </div>
                </Tooltip>

                <Tooltip
                  content={new Date(user.register_date).toLocaleString()}
                >
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Joined {timeSince(user.register_date)}</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <AdminUserBasicInfo user={user} />
            <AdminUserImages user={user} />
          </div>

          <div className="space-y-4">
            <AdminUserProfile user={user} />
            <AdminUserConnections user={user} />
          </div>
        </div>
      </div>
    </SensitiveInfoContext.Provider>
  );
}
