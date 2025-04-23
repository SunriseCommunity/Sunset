import Spinner from "@/components/Spinner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

type Props = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
  isWide?: boolean;
};

export default function ImageSelect({ setFile, file, isWide }: Props) {
  const uniqueId = Math.random().toString(36).substring(7);
  return (
    <div
      className={`flex items-center  ${
        isWide ? "max-w-72 md:max-w-96 w-full" : "max-w-40 w-full"
      }`}
    >
      <label htmlFor={uniqueId} className="cursor-pointer">
        <div
          className={`flex flex-col items-center justify-center ${
            isWide ? "max-w-72 md:max-w-96 w-full" : "max-w-40 w-full"
          }`}
        >
          <div
            className={`flex items-center justify-center w-full h-full bg-stone-800 rounded-lg`}
          >
            <input
              type="file"
              id={uniqueId}
              accept=".png, .jpg, .jpeg, .gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
            />
            {file ? (
              <div className={isWide ? "w-72 md:w-96" : "w-40"}>
                <AspectRatio
                  ratio={isWide ? 4 / 1 : 1 / 1}
                  className="bg-muted w-full h-full flex"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="avatar"
                    fill={true}
                    objectFit="cover"
                    className="w-full h-full rounded-lg hover:opacity-80 smooth-transition"
                  />
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
