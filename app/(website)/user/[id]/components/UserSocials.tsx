import {
  Briefcase,
  Globe2,
  HeartIcon,
  MapPin,
  Twitch,
} from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import * as React from "react";

import { CopyElement } from "@/components/CopyElement";
import { BiTwitterX } from "@/components/ui/icons/bi-twitter-x";
import { IcBaselineDiscord } from "@/components/ui/icons/ic-baseline-discord";
import { MdiTelegram } from "@/components/ui/icons/mdi-telegram";
import type { UserMetadataResponse } from "@/lib/types/api";

interface UserSocialsProps {
  metadata: UserMetadataResponse;
}

export const socialIcons: Partial<
  Record<keyof UserMetadataResponse, ReactElement>
> = {
  location: <MapPin className="size-3 flex-shrink-0" />,
  interest: <HeartIcon className="size-3 flex-shrink-0" />,
  occupation: <Briefcase className="size-3 flex-shrink-0" />,
  telegram: <MdiTelegram className="size-3 flex-shrink-0" />,
  twitch: <Twitch className="size-3 flex-shrink-0" />,
  twitter: <BiTwitterX className="size-3 flex-shrink-0" />,
  discord: <IcBaselineDiscord className="size-3 flex-shrink-0" />,
  website: <Globe2 className="size-3 flex-shrink-0" />,
};

export default function UserSocials({ metadata }: UserSocialsProps) {
  const linkElement = (title: string, link: string) => (
    <Link className="font-bold text-primary hover:underline" href={link}>
      {title}
    </Link>
  );

  const htmlTag = (v: keyof UserMetadataResponse, content: string) => {
    switch (v) {
      case "playstyle":
      case "location":
      case "interest":
      case "occupation":
        return <p className="font-bold text-muted-foreground">{content}</p>;
      case "telegram":
        return linkElement(content, `https://t.me/${content}`);
      case "twitch":
        return linkElement(content, `https://twitch.tv/${content}`);
      case "twitter":
        return linkElement(content, `https://x.com/${content}`);
      case "discord":
        return (
          <CopyElement copyContent={content}>
            <p className="font-bold text-primary hover:underline">{content}</p>
          </CopyElement>
        );
      case "website":
        return linkElement(content, content);
      default:
        return (
          <span className="font-bold text-muted-foreground">{content}</span>
        );
    }
  };

  return (
    <>
      <div className="my-1 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground/70">
        {Object.keys(metadata)
          .filter(
            v =>
              ["location", "interest", "occupation"].includes(v)
              && metadata[v as keyof UserMetadataResponse]?.toString().trim() !== "",
          )
          .map((v) => {
            const value = v as keyof UserMetadataResponse;

            return (
              <div className="flex items-center gap-2" key={v}>
                {socialIcons[value]}
                {htmlTag(value, metadata[value] as string)}
              </div>
            );
          })}
      </div>
      <div className="my-1 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground/70">
        {Object.keys(metadata)
          .filter(
            v =>
              !["location", "interest", "occupation", "playstyle"].includes(
                v,
              )
              && metadata[v as keyof UserMetadataResponse]?.toString().trim() !== "",
          )
          .map((v) => {
            const value = v as keyof UserMetadataResponse;

            return (
              <div className="flex items-center gap-2" key={v}>
                {socialIcons[value]}
                {htmlTag(value, metadata[value] as string)}
              </div>
            );
          })}
      </div>
    </>
  );
}
