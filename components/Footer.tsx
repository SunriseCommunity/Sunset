import { BookCopy, Github, ServerCrash, UsersRoundIcon } from "lucide-react";

export default async function Footer() {
  return (
    <footer className="border-t-2 text-current p-4 text-sm text-center space-y-4 bg-background/50 mt-8">
      <div className="md:flex grid justify-center space-x-4">
        <p>© 2024-2025 Sunrise Community</p>
        <p>•</p>
        <a
          href="https://github.com/SunriseCommunity"
          className="flex items-center justify-center space-x-1 hover:text-primary smooth-transition cursor-pointer"
        >
          <Github className="mr-1" />
          Source Code
        </a>
        <p>•</p>
        <a
          href={`https://uptime.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/`}
          className="flex items-center justify-center space-x-1 hover:text-primary smooth-transition cursor-pointer"
        >
          <ServerCrash className="mr-1" />
          Server Status
        </a>
        <p>•</p>
        <a
          href={`https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/docs`}
          className="flex items-center justify-center space-x-1 hover:text-primary smooth-transition cursor-pointer"
        >
          <BookCopy className="mr-1" />
          API Docs
        </a>
        <p>•</p>
        <a
          href={`https://discord.gg/BjV7c9VRfn`}
          className="flex items-center justify-center space-x-1 hover:text-primary smooth-transition cursor-pointer"
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
