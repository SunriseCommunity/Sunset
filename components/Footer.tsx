import { BookCopy, Github, ServerCrash, UsersRoundIcon } from "lucide-react";

export default async function Footer() {
  return (
    <footer className="border-t-2 text-white p-4 text-sm text-center space-y-4 bg-terracotta-950">
      <div className="flex justify-center space-x-4">
        <p>© 2024-2025 Sunrise Community</p>
        <p>•</p>
        <a
          href="https://github.com/SunriseCommunity"
          className="flex items-center space-x-1 hover:text-stone-400 smooth-transition cursor-pointer"
        >
          <Github className="mr-1" />
          Source Code
        </a>
        <p>•</p>
        <a
          href={`https://uptime.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/`}
          className="flex items-center space-x-1 hover:text-stone-400 smooth-transition cursor-pointer"
        >
          <ServerCrash className="mr-1" />
          Server Status
        </a>
        <p>•</p>
        <a
          href={`https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/docs`}
          className="flex items-center space-x-1 hover:text-stone-400 smooth-transition cursor-pointer"
        >
          <BookCopy className="mr-1" />
          API Docs
        </a>
        <p>•</p>
        <a
          href={`https://discord.gg/BjV7c9VRfn`}
          className="flex items-center space-x-1 hover:text-stone-400 smooth-transition cursor-pointer"
        >
          <UsersRoundIcon className="mr-1" />
          Discord server
        </a>
      </div>
      <p>
        We are not affiliated with "ppy" and "osu!" in any way. All rights
        reserved to their respective owners.
      </p>
    </footer>
  );
}
