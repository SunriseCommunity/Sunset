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

export default function Settings() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isBannerUploading, setIsBannerUploading] = useState(false);

  const { trigger, isMutating: isUpdatingDescription } = useEditDescription();

  const { trigger: triggerUserUpload } = useUserUpload();

  const { self, isLoading } = useSelf();

  useEffect(() => {
    if (self === undefined) return;

    fetch(
      `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${
        self.user_id
      }?${Date.now()}`
    ).then(async (res) => {
      const file = await res.blob();
      setAvatarFile(new File([file], "avatar.png"));
    });

    fetch(
      `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${
        self.user_id
      }?${Date.now()}`
    ).then(async (res) => {
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
          alert("Avatar uploaded successfully!");
          setIsAvatarUploading(false);
        },
        onError(err, key, config) {
          alert(err?.message ?? "An unknown error occurred");
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
          alert("Banner uploaded successfully!");
          setIsBannerUploading(false);
        },
        onError(err, key, config) {
          alert(err?.message ?? "An unknown error occurred");
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
          alert("Description updated successfully!");
        },
        onError(err) {
          alert(err.message || "An unknown error occurred");
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

  if (self === undefined)
    return (
      <div className="flex flex-col w-full mt-8 ">
        {/* Header */}
        <div
          className={`bg-terracotta-700 rounded-lg p-4 mb-4 flex justify-between items-center`}
        >
          <div className="flex items-center">
            <Cog className="mr-2" />
            <h2 className="text-xl font-bold">Settings</h2>
          </div>
        </div>

        {/* Log in message */}
        <div className="flex flex-col bg-terracotta-700 p-4 shadow-lg w-full rounded-lg">
          You must be logged in to view this page.
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full mt-8">
      {/* Header */}
      <PrettyHeader
        text="Settings"
        icon={<Cog />}
        className="bg-terracotta-700 mb-4"
        roundBottom={true}
      />

      {/* Change password */}
      <PrettyHeader text="Change password" icon={<LockOpenIcon />} />
      <div className="bg-terracotta-700 rounded-b-lg p-4 shadow-lg w-full mx-auto mb-4">
        <div className="flex flex-col w-11/12 mx-auto">
          <ChangePasswordInput />
        </div>
      </div>

      {/* Change username */}
      <PrettyHeader text="Change username" icon={<User2Icon />} />
      <div className="bg-terracotta-700 rounded-b-lg p-4 shadow-lg w-full mx-auto mb-4">
        <div className="flex flex-col w-11/12 mx-auto">
          <ChangeUsernameInput />
        </div>
      </div>

      {/* Change avatar */}
      <PrettyHeader text="Change avatar" icon={<User2Icon />} />
      <div className="bg-terracotta-700 rounded-b-lg p-4 shadow-lg w-full mx-auto mb-4">
        <div className="flex flex-col w-11/12 mx-auto">
          <ImageSelect setFile={setAvatarFile} file={avatarFile} />
          <StatusButton
            isLoading={isAvatarUploading}
            text="Upload avatar"
            onClick={uploadAvatar}
            className="mt-2 w-32 text-sm"
            icon={<CloudUpload />}
          />
          <label className="text-xs mt-2">
            * Note: Avatars are limited to 5MB in size
          </label>
        </div>
      </div>

      {/* Change banner */}
      <PrettyHeader text="Change banner" icon={<Image />} />
      <div className="bg-terracotta-700 rounded-b-lg p-4 shadow-lg w-full mx-auto mb-4">
        <div className="flex flex-col w-11/12 mx-auto">
          <ImageSelect setFile={setBannerFile} file={bannerFile} isWide />
          <StatusButton
            isLoading={isBannerUploading}
            text="Upload banner"
            onClick={uploadBanner}
            className="mt-2 w-32 text-sm"
            icon={<CloudUpload />}
          />
          <label className="text-xs mt-2">
            * Note: Banners are limited to 5MB in size
          </label>
        </div>
      </div>

      {/* Change description */}
      <PrettyHeader text="Change description" icon={<NotebookPenIcon />} />
      <div className="bg-terracotta-700 rounded-b-lg p-4 shadow-lg w-full mx-auto mb-4">
        <div className="flex flex-col w-11/12 mx-auto">
          <MarkdownInput
            defaultText={self?.description}
            onSave={saveDescription}
            isSaving={isUpdatingDescription}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <PrettyHeader text="Options" icon={<CheckSquare />} />
      <div className="bg-terracotta-700 rounded-b-lg p-4 shadow-lg w-full mx-auto mb-4">
        <div className="flex flex-col w-11/12 mx-auto">
          <SiteLocalOptions />
        </div>
      </div>
    </div>
  );
}
