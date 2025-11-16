"use client";
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
import { BookOpenCheck, DoorOpen, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { twMerge } from "tailwind-merge";
import { useTranslations, NextIntlClientProvider } from "next-intl";

const cards = [
  {
    titleKey: "cards.free_features.title",
    descriptionKey: "cards.free_features.description",
    imageUrl: "/images/frontpage/freefeatures.png",
  },

  {
    titleKey: "cards.pp_system.title",
    descriptionKey: "cards.pp_system.description",
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
    titleKey: "cards.pp_calc.title",
    descriptionKey: "cards.pp_calc.description",
    imageUrl: "/images/frontpage/ppcalc.png",
  },
  {
    titleKey: "cards.sunrise_core.title",
    descriptionKey: "cards.sunrise_core.description",
    imageUrl: "/images/frontpage/sunrisecore.png",
  },
];

export default function Home() {
  const videoUrls = [0, 1, 2, 3].map((n) => `/api/getVideo?id=${n}`);
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const t = useTranslations("main_page");
  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
    setMaintenanceDialogOpen(true);
  }

  return (
    <div className="w-full space-y-8">
      <div className="w-full flex items-center justify-center">
        <div className="relative z-20 flex place-content-between w-full md:mt-40 mt-24">
          <RoundedContent
            className={twMerge(
              "bg-transparent md:bg-gradient-to-r bg-gradient-to-t from-background via-background to-transparent",
              "w-full py-0 px-4 rounded-lg place-content-between space-x-4 flex md:flex-row flex-col-reverse"
            )}
          >
            <div className="flex flex-col justify-center space-y-4 my-4 md:w-5/12 ">
              <div className="">
                <h1 className="text-6xl">
                  <span className="text-primary dark">sun</span>
                  <span className="text-current">rise</span>
                </h1>
                <p className="text-muted-foreground italic text-sm">
                  {t("features.motto")}
                </p>
              </div>
              <p>{t("features.description")}</p>
              <div className="flex items-end space-x-4">
                <Button
                  className="from-red-400 via-orange-400 to-yellow-400 bg-gradient-to-r bg-size-300 animate-gradient hover:scale-105 smooth-transition"
                  size="lg"
                  asChild
                >
                  <Link href="/register">Join now</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/wiki#How%20to%20connect">How to connect</Link>
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
                  className="rounded-lg w-full h-full md:min-h-96 md:min-w-96"
                />
              </div>
            </div>
          </RoundedContent>

          <div className="-z-10 absolute inset-0 overflow-hidden rounded-lg">
            <BackgroundVideo
              urls={videoUrls}
              className="relative h-full w-full object-cover md:translate-x-1/4"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <ServerStatus
          type="server_status"
          data={
            serverStatus
              ? serverStatus.is_online
                ? serverStatus.is_on_maintenance
                  ? "Under Maintenance"
                  : "Online"
                : "Offline"
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
        <ServerStatus
          type="users_restricted"
          data={serverStatus?.total_restrictions!}
        />
        <ServerStatus type="total_scores" data={serverStatus?.total_scores!} />
      </div>

      <div className="w-full pb-12 items-center">
        <h2 className="text-4xl font-bold text-center py-8">Why us?</h2>

        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {cards.map((card, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 pl-0 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="overflow-y-auto  aspect-square transition-transform duration-300 scale-95 hover:scale-100 h-full">
                    <div className="relative h-1/2 w-full">
                      <Image
                        src={card.imageUrl || "/placeholder.svg"}
                        alt={card.titleKey}
                        fill
                        className="object-cover rounded-t-lg "
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold mb-2">
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
          <CarouselPrevious className="md:-left-12 left-6" />
          <CarouselNext className="md:-right-12 right-6" />
        </Carousel>
      </div>

      <div className="w-full p-4">
        <div className="py-8 space-y-4">
          <h2 className="text-4xl font-bold text-current">
            How do I start playing?
          </h2>

          <p className="text-muted-foreground">
            Just three simple steps and you're ready to go!
          </p>
        </div>

        <div className="space-y-2">
          <PrettyHeader icon={<Download />} className="rounded-lg">
            <div className="flex flex-col md:flex-row space-y-2 w-full">
              <div className="w-full flex flex-col mx-2">
                <p className="text-lg">Download osu! client</p>
                <p className="text-muted-foreground text-sm">
                  If you do not already have an installed client
                </p>
              </div>
              <Button className="md:w-1/3 md:m-0 w-full m-2" asChild>
                <Link href={"https://osu.ppy.sh/home/download"}>Download</Link>
              </Button>
            </div>
          </PrettyHeader>
          <PrettyHeader icon={<DoorOpen />} className="rounded-lg">
            <div className="flex flex-col md:flex-row space-y-2 w-full">
              <div className="w-full flex flex-col mx-2">
                <p className="text-lg">Register osu!sunrise account</p>
                <p className="text-muted-foreground text-sm">
                  Account will allow you to join the osu!sunrise community
                </p>
              </div>
              <Button className="md:w-1/3 md:m-0 w-full m-2" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          </PrettyHeader>
          <PrettyHeader icon={<BookOpenCheck />} className="rounded-lg">
            <div className="flex flex-col md:flex-row space-y-2 w-full">
              <div className="w-full flex flex-col mx-2">
                <p className="text-lg">Follow the connection guide</p>
                <p className="text-muted-foreground text-sm">
                  Which helps you set up your osu! client to connect to
                  osu!sunrise
                </p>
              </div>
              <Button className="md:w-1/3 md:m-0 w-full m-2" asChild>
                <Link href="/wiki#How%20to%20connect">Open guide</Link>
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
