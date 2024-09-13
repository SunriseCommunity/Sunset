import Image from "next/image";

export default async function Footer() {
  return (
    <footer className="border-t-2 text-white p-4 text-sm text-center space-y-4 bg-stone-950">
      <div className="flex justify-center space-x-4">
        <p>© 2024 Sunrise Community</p>
        <p>•</p>
        <a
          href="https://github.com/SunriseCommunity"
          className="flex items-center space-x-1 hover:text-stone-400 smooth-transition cursor-pointer"
        >
          <Image
            src="/icons/github.svg"
            width={16}
            height={16}
            alt="Source Code"
            className="dark:invert mr-1"
          />
          Source Code
        </a>
        <p>•</p>
        <a
          href={`https://uptime.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/`}
          className="flex items-center space-x-1 hover:text-stone-400 smooth-transition cursor-pointer"
        >
          <Image
            src="/icons/update.svg"
            width={16}
            height={16}
            alt="Server Status"
            className="dark:invert mr-1"
          />
          Server Status
        </a>
      </div>
      <p>
        We are not affiliated with "ppy" and "osu!" in any way. All rights
        reserved to their respective owners.
      </p>
    </footer>
  );
}
