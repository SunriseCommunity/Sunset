"use client";

import { CloudUpload } from "lucide-react";
import { useEffect, useState } from "react";

import ImageSelect from "@/components/General/ImageSelect";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserFileUpload } from "@/lib/hooks/api/user/types";
import { useUserUpload } from "@/lib/hooks/api/user/useUserUpload";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";

type UploadImageFormProps = {
  type: UserFileUpload;
};

export default function UploadImageForm({ type }: UploadImageFormProps) {
  const t = useT("pages.settings.components.uploadImage");
  const [file, setFile] = useState<File | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const { self } = useSelf();
  const { trigger: triggerUserUpload } = useUserUpload();
  const { toast } = useToast();

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f)
      setHasChanged(true);
  };

  const localizedType = t(`types.${type}`);

  useEffect(() => {
    if (self === undefined || file != null)
      return;

    const urlToFetch = type === "avatar" ? self.avatar_url : self.banner_url;

    fetch(urlToFetch).then(async (res) => {
      const blob = await res.blob();
      const ext
        = blob.type === "image/gif"
          ? "gif"
          : blob.type === "image/png"
            ? "png"
            : blob.type === "image/webp"
              ? "webp"
              : "jpg";

      setFile(new File([blob], `file.${ext}`, { type: blob.type }));
    });
  }, [file, self, type]);

  const uploadFile = async () => {
    if (file === null)
      return;

    setIsFileUploading(true);

    triggerUserUpload(
      {
        file,
        type,
      },
      {
        onSuccess() {
          toast({
            title: t("toast.success", { type: localizedType }),
            variant: "success",
            className: "capitalize",
          });
          setIsFileUploading(false);
          setHasChanged(false);
        },
        onError(err) {
          toast({
            title: err?.message ?? t("toast.error"),
            variant: "destructive",
          });
          setIsFileUploading(false);
        },
      },
    );
  };

  return (
    <>
      <ImageSelect
        setFile={handleFileChange}
        file={file}
        isWide={type === "banner"}
        maxFileSizeBytes={5 * 1024 * 1024}
        enableCrop
        type={type}
      />
      <Button
        isLoading={isFileUploading}
        onClick={uploadFile}
        className={`mt-2 w-40 text-sm${hasChanged ? " text-black" : ""}`}
        variant={hasChanged ? "default" : "secondary"}
      >
        <CloudUpload />
        {t("button", { type: localizedType })}
      </Button>
      <label className="mt-2 text-xs capitalize">
        {t("note", { type: localizedType })}
      </label>
    </>
  );
}
