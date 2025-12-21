"use client";

import ImageSelect from "@/components/General/ImageSelect";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserFileUpload } from "@/lib/hooks/api/user/types";
import { useUserUpload } from "@/lib/hooks/api/user/useUserUpload";
import useSelf from "@/lib/hooks/useSelf";
import { CloudUpload } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n/utils";

type UploadImageFormProps = {
  type: UserFileUpload;
};

export default function UploadImageForm({ type }: UploadImageFormProps) {
  const t = useT("pages.settings.components.uploadImage");
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const { self } = useSelf();

  const { trigger: triggerUserUpload } = useUserUpload();

  const localizedType = t(`types.${type}`);

  useEffect(() => {
    if (self === undefined || file != null) return;

    var urlToFetch = type === "avatar" ? self.avatar_url : self.banner_url;

    fetch(urlToFetch).then(async (res) => {
      const file = await res.blob();
      setFile(new File([file], "file.png"));
    });
  }, [self]);

  const { toast } = useToast();

  const uploadFile = async () => {
    if (file === null) return;

    setIsFileUploading(true);

    triggerUserUpload(
      {
        file: file,
        type: type,
      },
      {
        onSuccess(data, key, config) {
          toast({
            title: t("toast.success", { type: localizedType }),
            variant: "success",
            className: "capitalize",
          });
          setIsFileUploading(false);
        },
        onError(err, key, config) {
          toast({
            title: err?.message ?? t("toast.error"),
            variant: "destructive",
          });
          setIsFileUploading(false);
        },
      }
    );
  };

  return (
    <>
      <ImageSelect
        setFile={setFile}
        file={file}
        isWide={type === "banner"}
        maxFileSizeBytes={5 * 1024 * 1024}
      />
      <Button
        isLoading={isFileUploading}
        onClick={uploadFile}
        className="mt-2 w-40 text-sm"
        variant="secondary"
      >
        <CloudUpload />
        {t("button", { type: localizedType })}
      </Button>
      <label className="text-xs mt-2 capitalize">
        {t("note", { type: localizedType })}
      </label>
    </>
  );
}
