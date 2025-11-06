"use client";

import { UserSensitiveResponse } from "@/lib/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, User, KeyRound } from "lucide-react";

import { useUserPreviousUsernames } from "@/lib/hooks/api/user/useUserPreviousUsernames";
import { Badge } from "@/components/ui/badge";

import AdminUserRestrictButton from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserRestrictButton";
import AdminUserEmailInput from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserEmailInput";
import AdminUserUsernameInput from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserUsernameInput";
import AdminUserResetPassword from "@/app/(admin)/admin/users/[id]/edit/components/AdminUserResetPassword";

export default function AdminUserBasicInfo({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const { data: previousUsernames } = useUserPreviousUsernames(user.user_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Username
          </Label>
          <AdminUserUsernameInput user={user} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <AdminUserEmailInput user={user} />
        </div>

        <div className="border-t border-border" />

        {previousUsernames && previousUsernames.usernames.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs">Previous Usernames</Label>
            <div className="flex flex-wrap gap-2">
              {previousUsernames.usernames.map((username, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {username}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <AdminUserRestrictButton user={user} />
        <AdminUserResetPassword user={user} />
      </CardContent>
    </Card>
  );
}
