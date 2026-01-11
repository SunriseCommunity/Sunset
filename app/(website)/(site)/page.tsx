"use client";
import { BookOpenCheck, DoorOpen, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import BackgroundVideo from "@/app/(website)/(site)/components/BackgroundVideo";
import RecentUsersIcons from "@/app/(website)/(site)/components/RecentUsersIcons";
import ServerStatus from "@/app/(website)/(site)/components/ServerStatus";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { useT } from "@/lib/i18n/utils";

const cards = [
  {
    titleKey: "cards.freeFeatures.title",
    descriptionKey: "cards.freeFeatures.description",
    imageUrl: "/images/frontpage/freefeatures.png",
  },

  {
    titleKey: "cards.ppSystem.title",
    descriptionKey: "cards.ppSystem.description",
    imageUrl: "/images/frontpage/ppsystem.png",
  },
  // TODO: Soon™...
  // {
  //   title: "Anti-Cheat Protection",
  //   description:
  //     "We take cheating seriously — our advanced anti-cheat systems constantly monitor and detect suspicious or manipulated scores.",
  //   imageUrl: "/images/not-found.jpg",
  // },
  {
    titleKey: "cards.medals.title",
    descriptionKey: "cards.medals.description",
    imageUrl: "/images/frontpage/medals.png",
  },
  {
    titleKey: "cards.updates.title",
    descriptionKey: "cards.updates.description",
    imageUrl: "/images/frontpage/updates.png",
  },
  {
    titleKey: "cards.ppCalc.title",
    descriptionKey: "cards.ppCalc.description",
    imageUrl: "/images/frontpage/ppcalc.png",
  },
  {
    titleKey: "cards.sunriseCore.title",
    descriptionKey: "cards.sunriseCore.description",
    imageUrl: "/images/frontpage/sunrisecore.png",
  },
];

export default function Home() {
  const videoUrls = [0, 1, 2, 3].map(n => `/api/getVideo?id=${n}`);
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
    setMaintenanceDialogOpen(true);
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex w-full items-center justify-center">
        <div className="relative z-20 mt-24 flex w-full place-content-between md:mt-40">
          <RoundedContent
            className={twMerge(
              "bg-transparent md:bg-gradient-to-r bg-gradient-to-t from-background via-background to-transparent",
              "w-full py-0 px-4 rounded-lg place-content-between space-x-4 flex md:flex-row flex-col-reverse",
            )}
          >
            <div className="my-4 flex flex-col justify-center space-y-4 md:w-5/12 ">
              <div className="space-y-2">
                <h1 className="text-6xl">
                  <span className="dark text-primary">
                    {tGeneral("serverTitle.split.part1")}
                  </span>
                  <span className="text-current">
                    {tGeneral("serverTitle.split.part2")}
                  </span>
                </h1>
                <p className="text-sm italic text-muted-foreground">
                  {t("features.motto")}
                </p>
              </div>
              <p>{t("features.description")}</p>
              <div className="flex items-end space-x-4">
                <Button
                  className="smooth-transition animate-gradient bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-size-300 hover:scale-105"
                  size="lg"
                  asChild
                >
                  <Link href="/register">{t("features.buttons.register")}</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/wiki#How%20to%20connect">
                    {t("features.buttons.wiki")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative h-full md:w-7/12 lg:w-5/12 ">
              <div className="-mt-28">
                <Image
                  src="/images/frontpage.png"
                  alt="frontpage image"
                  width={1150}
                  height={1150}
                  className="size-full rounded-lg md:min-h-96 md:min-w-96"
                />
              </div>
            </div>
          </RoundedContent>

          <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
            <BackgroundVideo
              urls={videoUrls}
              className="relative size-full object-cover md:translate-x-1/4"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <ServerStatus
          type="server_status"
          data={
            serverStatus
              ? serverStatus.is_online
                ? serverStatus.is_on_maintenance
                  ? t("statuses.underMaintenance")
                  : t("statuses.online")
                : t("statuses.offline")
              : undefined
          }
        />
        <ServerStatus type="total_users" data={serverStatus?.total_users}>
          {serverStatus && (
            <RecentUsersIcons users={serverStatus.recent_users!} />
          )}
        </ServerStatus>
        <ServerStatus type="users_online" data={serverStatus?.users_online}>
          {serverStatus && (
            <RecentUsersIcons users={serverStatus.current_users_online!} />
          )}
        </ServerStatus>
        {serverStatus && (
          <ServerStatus
            type="users_restricted"
            data={serverStatus.total_restrictions!}
          />
        )}
        {serverStatus && (
          <ServerStatus type="total_scores" data={serverStatus.total_scores!} />
        )}
      </div>

      <div className="w-full items-center pb-12">
        <h2 className="py-8 text-center text-4xl font-bold">{t("whyUs")}</h2>

        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {cards.map(card => (
              <CarouselItem
                key={`card-${card.titleKey}`}
                className="pl-0 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="aspect-square  h-full scale-95 overflow-y-auto transition-transform duration-300 hover:scale-100">
                    <div className="relative h-1/2 w-full">
                      <Image
                        src={card.imageUrl || "/placeholder.svg"}
                        alt={card.titleKey}
                        fill
                        className="rounded-t-lg object-cover "
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-lg font-bold">
                        {t(card.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(card.descriptionKey)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-6 md:-left-12" />
          <CarouselNext className="right-6 md:-right-12" />
        </Carousel>
      </div>

      <div className="w-full p-4">
        <div className="space-y-4 py-8">
          <h2 className="text-4xl font-bold text-current">
            {t("howToStart.title")}
          </h2>

          <p className="text-muted-foreground">{t("howToStart.description")}</p>
        </div>

        <div className="space-y-2">
          <PrettyHeader icon={<Download />} className="rounded-lg">
            <div className="flex w-full flex-col space-y-2 md:flex-row">
              <div className="mx-2 flex w-full flex-col">
                <p className="text-lg">{t("howToStart.downloadTile.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("howToStart.downloadTile.description")}
                </p>
              </div>
              <Button className="m-2 w-full md:m-0 md:w-1/3" asChild>
                <Link href="https://osu.ppy.sh/home/download">
                  {t("howToStart.downloadTile.button")}
                </Link>
              </Button>
            </div>
          </PrettyHeader>
          <PrettyHeader icon={<DoorOpen />} className="rounded-lg">
            <div className="flex w-full flex-col space-y-2 md:flex-row">
              <div className="mx-2 flex w-full flex-col">
                <p className="text-lg">{t("howToStart.registerTile.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("howToStart.registerTile.description")}
                </p>
              </div>
              <Button className="m-2 w-full md:m-0 md:w-1/3" asChild>
                <Link href="/register">
                  {t("howToStart.registerTile.button")}
                </Link>
              </Button>
            </div>
          </PrettyHeader>
          <PrettyHeader icon={<BookOpenCheck />} className="rounded-lg">
            <div className="flex w-full flex-col space-y-2 md:flex-row">
              <div className="mx-2 flex w-full flex-col">
                <p className="text-lg">{t("howToStart.guideTile.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("howToStart.guideTile.description")}
                </p>
              </div>
              <Button className="m-2 w-full md:m-0 md:w-1/3" asChild>
                <Link href="/wiki#How%20to%20connect">
                  {t("howToStart.guideTile.button")}
                </Link>
              </Button>
            </div>
          </PrettyHeader>
        </div>
      </div>

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
