import Spinner from "@/components/Spinner";

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
        isWide ? "max-w-96 w-full" : "max-w-32 w-full"
      }`}
    >
      <label htmlFor={uniqueId} className="cursor-pointer">
        <div
          className={`flex flex-col items-center justify-center ${
            isWide ? "max-w-96 w-full" : "max-w-32 w-full"
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
              <img
                src={URL.createObjectURL(file)}
                alt="avatar"
                className="w-full rounded-lg hover:opacity-80 smooth-transition"
              />
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
