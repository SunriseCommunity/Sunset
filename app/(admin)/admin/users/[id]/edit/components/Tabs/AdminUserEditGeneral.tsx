"use client";

import { Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createContext } from "react";

import AdminUserBasicInfo from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserBasicInfo";
import AdminUserConnections from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserConnections";
import AdminUserImages from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserImages";
import AdminUserProfile from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserProfile";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UserSensitiveResponse } from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";

export const SensitiveInfoContext = createContext<boolean>(false);

export default function AdminUserEditGeneral({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const isUserOffline = user.user_status === "Offline";

  return (
    <SensitiveInfoContext value={true}>
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
              <div className="relative size-20 overflow-hidden rounded-full border-4 border-card shadow-xl sm:size-24">
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-6 pt-16 sm:px-8 sm:pt-14">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold sm:text-2xl">
                    {user.username}
                  </h1>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-7 p-0"
                    asChild
                  >
                    <Link href={`/user/${user.user_id}`} target="_blank">
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ID: {user.user_id}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Tooltip
                  content={new Date(user.last_online_time).toLocaleString()}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-2 rounded-full ${
                        !isUserOffline
                          ? `bg-${statusColor(user.user_status)} animate-pulse`
                          : "bg-gray-500"
                      }`}
                    />

                    <UserStatusText
                      className={!isUserOffline ? "font-bold" : ""}
                      user={user}
                      disabled
                    />
                  </div>
                </Tooltip>

                <Tooltip
                  content={new Date(user.register_date).toLocaleString()}
                >
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>Joined {timeSince(user.register_date)}</span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
    </SensitiveInfoContext>
  );
}
