import Image from "next/image";

interface ContentNotExistProps {
  text?: string;
}

export function ContentNotExist({ text }: ContentNotExistProps) {
  return (
    <div className="text-current p-4 rounded-lg flex flex-col md:flex-row text-center items-center justify-center space-x-4">
      <Image
        src="/images/content-not-found.png"
        alt="content-not-found"
        width={200}
        height={200}
      />
      <div>
        <h1 className="text-2xl font-semibold">
          {text ?? "Content not found"}
        </h1>
      </div>
    </div>
  );
}
