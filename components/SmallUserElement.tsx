import Image from "next/image";
import Link from "next/link";

interface SmallUserElementProps {
  avatarUrl: string;
  profileUrl: string;
  username: string;
}

export function SmallUserElement({
  avatarUrl,
  profileUrl,
  username,
}: SmallUserElementProps) {
  return (
    <Link href={profileUrl}>
      <div className="flex items-center gap-1 ">
        <div className="relative size-4 overflow-hidden rounded">
          <Image
            src={avatarUrl}
            alt={`${username}'s avatar`}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <span>{username}</span>
      </div>
    </Link>
  );
}

export function BanchoSmallUserElement({
  user_id,
  username,
}: {
  user_id: number;
  username: string;
}) {
  return (
    <SmallUserElement
      avatarUrl={`https://a.ppy.sh/${user_id}`}
      profileUrl={`https://osu.ppy.sh/u/${user_id}`}
      username={username}
    />
  );
}
