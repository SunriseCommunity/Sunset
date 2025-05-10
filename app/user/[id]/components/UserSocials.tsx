import {
  Briefcase,
  GamepadIcon,
  Globe2,
  HeartIcon,
  MapPin,
  Twitch,
} from "lucide-react";

import React, { ReactElement } from "react";
import { UserMetadataResponse } from "@/lib/types/api";
import { MdiTelegram } from "@/components/ui/icons/mdi-telegram";
import { IcBaselineDiscord } from "@/components/ui/icons/ic-baseline-discord";
import { BiTwitterX } from "@/components/ui/icons/bi-twitter-x";
import Link from "next/link";
import { CopyElement } from "@/components/CopyElement";

interface UserSocialsProps {
  metadata: UserMetadataResponse;
}

export const socialIcons: Partial<
  Record<keyof UserMetadataResponse, ReactElement>
> = {
  location: <MapPin className="h-3 w-3 flex-shrink-0" />,
  interest: <HeartIcon className="h-3 w-3 flex-shrink-0" />,
  occupation: <Briefcase className="h-3 w-3 flex-shrink-0" />,
  telegram: <MdiTelegram className="h-3 w-3 flex-shrink-0" />,
  twitch: <Twitch className="h-3 w-3 flex-shrink-0" />,
  twitter: <BiTwitterX className="h-3 w-3 flex-shrink-0" />,
  discord: <IcBaselineDiscord className="h-3 w-3 flex-shrink-0" />,
  website: <Globe2 className="h-3 w-3 flex-shrink-0" />,
};

export default function UserSocials({ metadata }: UserSocialsProps) {
  const linkElement = (title: string, link: string) => (
    <Link className="text-primary hover:underline font-bold" href={link}>
      {title}
    </Link>
  );

  const htmlTag = (v: keyof UserMetadataResponse, content: string) => {
    switch (v) {
      case "playstyle":
      case "location":
      case "interest":
      case "occupation":
        return <p className="text-muted-foreground font-bold">{content}</p>;
      case "telegram":
        return linkElement(content, `https://t.me/${content}`);
      case "twitch":
        return linkElement(content, `https://twitch.tv/${content}`);
      case "twitter":
        return linkElement(content, `https://x.com/${content}`);
      case "discord":
        return (
          <CopyElement copyContent={content}>
            <p className="text-primary hover:underline font-bold">{content}</p>
          </CopyElement>
        );
      case "website":
        return linkElement(content, content);
      default:
        return (
          <span className="text-muted-foreground font-bold">{content}</span>
        );
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-x-6 gap-y-2 my-1 text-xs text-muted-foreground/70">
        {Object.keys(metadata)
          .filter(
            (v) =>
              ["location", "interest", "occupation"].includes(v) &&
              metadata[v as keyof UserMetadataResponse]?.toString().trim() != ""
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
      <div className="flex flex-wrap gap-x-6 gap-y-2 my-1 text-xs text-muted-foreground/70">
        {Object.keys(metadata)
          .filter(
            (v) =>
              !["location", "interest", "occupation", "playstyle"].includes(
                v
              ) &&
              metadata[v as keyof UserMetadataResponse]?.toString().trim() != ""
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
