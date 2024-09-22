import Image from "next/image";

export function WorkInProgress() {
  return (
    <div className="text-white p-4 rounded-lg flex flex-row items-center justify-center space-x-4">
      <Image src="/images/wip.png" alt="wip" width={200} height={200} />
      <div>
        <h1 className="text-2xl font-semibold">Work in progress</h1>
        <p>This content is still being worked on. Please check back later.</p>
      </div>
    </div>
  );
}
