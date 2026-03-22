import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useState } from "react";

import Spinner from "@/components/Spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import { useT } from "@/lib/i18n/utils";

const ImageCropDialog = dynamic(
  () => import("@/components/General/ImageCropDialog"),
  { ssr: false },
);

type Props = {
  setFile: (file: File | null) => void;
  file: File | null;
  isWide?: boolean;
  maxFileSizeBytes?: number;
  userImageCrop?: {
    type: "avatar" | "banner";
  };
};

export default function ImageSelect({
  setFile,
  file,
  isWide,
  maxFileSizeBytes,
  userImageCrop,
}: Props) {
  const t = useT("components.imageSelect");
  const inputId = useId();

  const { toast } = useToast();

  const [rawFileForCrop, setRawFileForCrop] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setRawFileForCrop(null);
    }
  }, []);

  const handleFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0];
    e.currentTarget.value = "";

    if (!nextFile)
      return;

    if (maxFileSizeBytes && nextFile.size > maxFileSizeBytes) {
      toast({
        title: t("imageTooBig"),
        variant: "destructive",
      });
      return;
    }

    const isGif = nextFile.type === "image/gif";
    const shouldCrop = Boolean(userImageCrop && !isGif);

    if (shouldCrop) {
      setRawFileForCrop(nextFile);
      return;
    }

    setFile(nextFile);
  }, [maxFileSizeBytes, toast, t, setFile, userImageCrop]);

  const handleCropped = (croppedFile: File) => {
    setFile(croppedFile);
    setRawFileForCrop(null);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <label htmlFor={inputId} className="w-full cursor-pointer">
          <div
            className={`flex flex-col items-center justify-center ${
              isWide
                ? "w-72 max-w-full flex-shrink md:w-96"
                : "w-40 max-w-full flex-shrink"
            }`}
          >
            <div className="flex w-full items-center justify-center rounded-lg bg-transparent">
              <input
                type="file"
                id={inputId}
                accept="image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={handleFileSelected}
              />

              {file ? (
                <div className="w-full flex-shrink">
                  <AspectRatio ratio={isWide ? 4 / 1 : 1 / 1} className="w-full">
                    <div className="relative size-full overflow-hidden rounded-lg">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="upload preview"
                          className="smooth-transition size-full object-cover hover:opacity-80"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Spinner size="lg" />
                        </div>
                      )}
                    </div>
                  </AspectRatio>
                </div>
              ) : (
                <div className="mx-auto px-12">
                  <Spinner size="lg" />
                </div>
              )}
            </div>
          </div>
        </label>
      </div>

      {userImageCrop && rawFileForCrop && (
        <ImageCropDialog
          file={rawFileForCrop}
          type={userImageCrop.type}
          open={!!rawFileForCrop}
          onOpenChange={handleOpenChange}
          onCropped={handleCropped}
        />
      )}
    </>
  );
}
