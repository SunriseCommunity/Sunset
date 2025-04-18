"use client";
import ImageSelect from "@/components/General/ImageSelect";
import Spinner from "@/components/Spinner";
import StatusButton from "@/components/General/PrettyButton";
import useSelf from "@/lib/hooks/useSelf";
import {
  CheckSquare,
  CloudUpload,
  Cog,
  Image,
  LockOpenIcon,
  NotebookPenIcon,
  User2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import MarkdownInput from "./components/MarkdownInput";
import ChangePasswordInput from "@/app/settings/components/ChangePasswordInput";
import SiteLocalOptions from "@/app/settings/components/SiteLocalOptions";
import ChangeUsernameInput from "@/app/settings/components/ChangeUsernameInput";
import { useEditDescription } from "@/lib/hooks/api/user/useEditDescription";
import { useUserUpload } from "@/lib/hooks/api/user/useUserUpload";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isBannerUploading, setIsBannerUploading] = useState(false);

  const { trigger, isMutating: isUpdatingDescription } = useEditDescription();

  const { trigger: triggerUserUpload } = useUserUpload();

  const { self, isLoading } = useSelf();

  const { toast } = useToast();

  useEffect(() => {
    if (self === undefined) return;

    fetch(self.avatar_url).then(async (res) => {
      const file = await res.blob();
      setAvatarFile(new File([file], "avatar.png"));
    });

    fetch(self.banner_url).then(async (res) => {
      const file = await res.blob();
      setBannerFile(new File([file], "banner.png"));
    });
  }, [self]);

  const uploadAvatar = async () => {
    if (avatarFile === null) return;

    setIsAvatarUploading(true);

    triggerUserUpload(
      {
        file: avatarFile,
        type: "avatar",
      },
      {
        onSuccess(data, key, config) {
          toast({ title: "Avatar updated successfully!" });
          setIsAvatarUploading(false);
        },
        onError(err, key, config) {
          toast({
            title: err?.message ?? "An unknown error occurred",
            variant: "destructive",
          });
          setIsAvatarUploading(false);
        },
      }
    );
  };

  const uploadBanner = async () => {
    if (bannerFile === null) return;

    setIsBannerUploading(true);

    triggerUserUpload(
      {
        file: bannerFile,
        type: "banner",
      },
      {
        onSuccess(data, key, config) {
          toast({ title: "Banner updated successfully!" });
          setIsBannerUploading(false);
        },
        onError(err, key, config) {
          toast({
            title: err?.message ?? "An unknown error occurred",
            variant: "destructive",
          });
          setIsBannerUploading(false);
        },
      }
    );
  };

  const saveDescription = (text: string) => {
    trigger(
      { description: text },
      {
        onSuccess() {
          toast({ title: "Description updated successfully!" });
        },
        onError(err) {
          toast({
            title: err?.message ?? "An unknown error occurred",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="flex flex-col w-full mt-8 space-y-4 mb-8">
      <PrettyHeader
        className="mb-4"
        text="Settings"
        icon={<Cog className="mr-2" />}
        roundBottom
      />

      {self ? (
        <>
          <div>
            <PrettyHeader text="Change password" icon={<LockOpenIcon />} />
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <ChangePasswordInput />
              </div>
            </RoundedContent>
          </div>

          <div>
            <PrettyHeader text="Change username" icon={<User2Icon />} />
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <ChangeUsernameInput />
              </div>
            </RoundedContent>
          </div>

          <div>
            <PrettyHeader text="Change avatar" icon={<User2Icon />} />
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <ImageSelect setFile={setAvatarFile} file={avatarFile} />
                <Button
                  isLoading={isAvatarUploading}
                  onClick={uploadAvatar}
                  className="mt-2 w-40 text-sm"
                  variant="secondary"
                >
                  <CloudUpload />
                  Upload avatar
                </Button>
                <label className="text-xs mt-2">
                  * Note: Avatars are limited to 5MB in size
                </label>
              </div>
            </RoundedContent>
          </div>

          <div>
            <PrettyHeader text="Change banner" icon={<Image />} />
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <ImageSelect setFile={setBannerFile} file={bannerFile} isWide />
                <Button
                  isLoading={isBannerUploading}
                  onClick={uploadBanner}
                  className="mt-2 w-40 text-sm"
                  variant="secondary"
                >
                  <CloudUpload />
                  Upload banner
                </Button>
                <label className="text-xs mt-2">
                  * Note: Banners are limited to 5MB in size
                </label>
              </div>
            </RoundedContent>
          </div>

          <div>
            <PrettyHeader
              text="Change description"
              icon={<NotebookPenIcon />}
            />
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <MarkdownInput
                  defaultText={self?.description}
                  onSave={saveDescription}
                  isSaving={isUpdatingDescription}
                />
              </div>
            </RoundedContent>
          </div>

          <div>
            <PrettyHeader text="Options" icon={<CheckSquare />} />
            <RoundedContent>
              <div className="flex flex-col w-11/12 mx-auto">
                <SiteLocalOptions />
              </div>
            </RoundedContent>
          </div>
        </>
      ) : (
        <RoundedContent className="rounded-lg">
          You must be logged in to view this page.
        </RoundedContent>
      )}
    </div>
  );
}
