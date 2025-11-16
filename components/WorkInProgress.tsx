import Image from "next/image";

export function WorkInProgress() {
  return (
    <div className="text-current p-4 rounded-lg items-center justify-center space-x-4 flex flex-col">
      <Image
        src="/images/wip.png"
        alt="wip"
        width={200}
        height={400}
        className="max-w-fit"
      />
      <div>
        <h1 className="text-2xl font-semibold">Work in progress</h1>
        <p>This content is still being worked on. Please check back later.</p>
      </div>
    </div>
  );
}
