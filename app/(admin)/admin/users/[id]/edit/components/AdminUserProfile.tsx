"use client";

import { FileText, Flag, Gamepad2, Globe } from "lucide-react";
import { useState } from "react";

import ChangeCountryInput from "@/app/(website)/settings/components/ChangeCountryInput";
import ChangeDescriptionInput from "@/app/(website)/settings/components/ChangeDescriptionInput";
import ChangePlaystyleForm from "@/app/(website)/settings/components/ChangePlaystyleForm";
import ChangeSocialsForm from "@/app/(website)/settings/components/ChangeSocialsForm";
import Spinner from "@/components/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import type { UserSensitiveResponse } from "@/lib/types/api";

export default function AdminUserProfile({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const { data: userMetadata } = useUserMetadata(user.user_id);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 ">
            <TabsTrigger value="description" className="text-xs md:text-sm">
              <FileText className="mr-1 size-4 flex-shrink-0 " />
              About
            </TabsTrigger>
            <TabsTrigger value="country" className="text-xs md:text-sm">
              <Flag className="mr-1 size-4 flex-shrink-0" />
              Country
            </TabsTrigger>
            <TabsTrigger value="socials" className="text-xs md:text-sm">
              <Globe className="mr-1 size-4 flex-shrink-0 " />
              Socials
            </TabsTrigger>
            <TabsTrigger value="playstyle" className="text-xs md:text-sm">
              <Gamepad2 className="mr-1 size-4 flex-shrink-0 " />
              Playstyle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4 space-y-4">
            <ChangeDescriptionInput user={user} />
          </TabsContent>

          <TabsContent value="country" className="mt-4 space-y-4">
            <ChangeCountryInput user={user} className="lg:w-full" />
          </TabsContent>

          <TabsContent value="socials" className="mt-4 space-y-4">
            {userMetadata && user ? (
              <ChangeSocialsForm
                metadata={userMetadata}
                user={user}
                className="lg:w-full"
              />
            ) : (
              <Spinner />
            )}
          </TabsContent>

          <TabsContent value="playstyle" className="mt-4 space-y-4">
            {userMetadata && user ? (
              <ChangePlaystyleForm
                user={user}
                metadata={userMetadata}
                className="lg:w-full"
              />
            ) : (
              <Spinner />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
