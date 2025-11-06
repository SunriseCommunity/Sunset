"use client";

import { useState } from "react";
import { UserSensitiveResponse } from "@/lib/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Flag, Globe, Gamepad2 } from "lucide-react";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import Spinner from "@/components/Spinner";
import ChangeCountryInput from "@/app/(website)/settings/components/ChangeCountryInput";
import ChangeSocialsForm from "@/app/(website)/settings/components/ChangeSocialsForm";
import ChangePlaystyleForm from "@/app/(website)/settings/components/ChangePlaystyleForm";
import ChangeDescriptionInput from "@/app/(website)/settings/components/ChangeDescriptionInput";

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
          <FileText className="w-5 h-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">
              <FileText className="w-4 h-4 mr-1" />
              About
            </TabsTrigger>
            <TabsTrigger value="country">
              <Flag className="w-4 h-4 mr-1" />
              Country
            </TabsTrigger>
            <TabsTrigger value="socials">
              <Globe className="w-4 h-4 mr-1" />
              Socials
            </TabsTrigger>
            <TabsTrigger value="playstyle">
              <Gamepad2 className="w-4 h-4 mr-1" />
              Playstyle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4 mt-4">
            <ChangeDescriptionInput user={user} />
          </TabsContent>

          <TabsContent value="country" className="space-y-4 mt-4">
            <ChangeCountryInput user={user} className="lg:w-full" />
          </TabsContent>

          <TabsContent value="socials" className="space-y-4 mt-4">
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

          <TabsContent value="playstyle" className="space-y-4 mt-4">
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
