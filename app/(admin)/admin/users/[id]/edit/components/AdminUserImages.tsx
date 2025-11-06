"use client";

import { useEffect, useState } from "react";
import { UserSensitiveResponse } from "@/lib/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Upload } from "lucide-react";
import ImageSelect from "@/components/General/ImageSelect";
import { Button } from "@/components/ui/button";
import {
  useAdminUploadAvatar,
  useAdminUploadBanner,
} from "@/lib/hooks/api/user/useAdminUserEdit";
import { useToast } from "@/hooks/use-toast";

export default function AdminUserImages({
  user,
}: {
  user: UserSensitiveResponse;
}) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [activeTab, setActiveTab] = useState("avatar");

  const { trigger: uploadAvatar, isMutating: isUploadingAvatar } =
    useAdminUploadAvatar(user.user_id);
  const { trigger: uploadBanner, isMutating: isUploadingBanner } =
    useAdminUploadBanner(user.user_id);
  const { toast } = useToast();

  useEffect(() => {
    const fetches: Promise<void>[] = [];
    let isCancelled = false;

    if (avatarFile == null) {
      const avatarUrl = user.avatar_url;

      fetches.push(
        fetch(avatarUrl)
          .then(async (res) => {
            if (isCancelled) return;
            const file = await res.blob();
            if (!isCancelled) {
              setAvatarFile(new File([file], "file.png"));
            }
          })
          .catch((error) => {
            if (!isCancelled) {
              console.error("Failed to fetch avatar:", error);
            }
          })
      );
    }

    if (bannerFile == null) {
      const bannerUrl = user.banner_url;

      fetches.push(
        fetch(bannerUrl)
          .then(async (res) => {
            if (isCancelled) return;
            const file = await res.blob();
            if (!isCancelled) {
              setBannerFile(new File([file], "file.png"));
            }
          })
          .catch((error) => {
            if (!isCancelled) {
              console.error("Failed to fetch banner:", error);
            }
          })
      );
    }

    Promise.all(fetches);

    return () => {
      isCancelled = true;
    };
  }, [user, avatarFile, bannerFile]);

  const handleUpload = async (type: "avatar" | "banner") => {
    const file = type === "avatar" ? avatarFile : bannerFile;
    if (!file) return;

    try {
      if (type === "avatar") {
        await uploadAvatar(file);
        toast({
          title: "Avatar uploaded successfully!",
          variant: "success",
        });
      } else {
        await uploadBanner(file);
        toast({
          title: "Banner uploaded successfully!",
          variant: "success",
        });
      }
    } catch (error: any) {
      toast({
        title: `Failed to upload ${type}`,
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="banner">Banner</TabsTrigger>
          </TabsList>

          <TabsContent value="avatar" className="space-y-4 mt-4">
            <ImageSelect
              setFile={setAvatarFile}
              file={avatarFile}
              isWide={false}
              maxFileSizeBytes={5 * 1024 * 1024}
            />
            <Button
              onClick={() => handleUpload("avatar")}
              disabled={!avatarFile || isUploadingAvatar}
              isLoading={isUploadingAvatar}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Avatar
            </Button>
            <p className="text-xs text-muted-foreground">
              * Maximum file size: 5MB
            </p>
          </TabsContent>

          <TabsContent value="banner" className="space-y-4 mt-4">
            <ImageSelect
              setFile={setBannerFile}
              file={bannerFile}
              isWide={true}
              maxFileSizeBytes={5 * 1024 * 1024}
            />
            <Button
              onClick={() => handleUpload("banner")}
              disabled={!bannerFile || isUploadingBanner}
              isLoading={isUploadingBanner}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Banner
            </Button>
            <p className="text-xs text-muted-foreground">
              * Maximum file size: 5MB
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
