import Spinner from "@/components/Spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useT } from "@/lib/i18n/utils";

type Props = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
  isWide?: boolean;
  maxFileSizeBytes?: number;
};

export default function ImageSelect({
  setFile,
  file,
  isWide,
  maxFileSizeBytes,
}: Props) {
  const t = useT("components.imageSelect");
  const uniqueId = Math.random().toString(36).substring(7);

  const { toast } = useToast();

  return (
    <div className="flex items-center w-full justify-center">
      <label htmlFor={uniqueId} className="cursor-pointer w-full">
        <div
          className={`flex flex-col items-center justify-center ${
            isWide
              ? "w-72 md:w-96 max-w-full flex-shrink"
              : "w-40 max-w-full flex-shrink"
          }`}
        >
          <div className="flex items-center justify-center w-full bg-transparent rounded-lg">
            <input
              type="file"
              id={uniqueId}
              accept=".png, .jpg, .jpeg, .gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
                  toast({
                    title: t("imageTooBig"),
                    variant: "destructive",
                  });
                  return;
                }
                if (e.target.files) setFile(file);
              }}
            />

            {file ? (
              <div className="w-full flex-shrink">
                <AspectRatio ratio={isWide ? 4 / 1 : 1 / 1} className="w-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="avatar"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg hover:opacity-80 smooth-transition"
                    />
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
  );
}
