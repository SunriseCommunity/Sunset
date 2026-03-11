"use client";

import {
  Download,
  Eye,
  Gauge,
  Puzzle,
  Settings,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useT } from "@/lib/i18n/utils";

const PATCHER_DOWNLOAD_URL
  = "https://github.com/SunriseCommunity/osu-patcher/releases/latest/download/osu-patcher-for-sunrise-based-server.rar";

const ORIGINAL_REPO_URL = "https://github.com/rushiiMachine/osu-patcher";

const featureCategories = [
  { key: "relax", icon: <Puzzle className="size-4" /> },
  { key: "pp", icon: <Gauge className="size-4" /> },
  { key: "mods", icon: <Eye className="size-4" /> },
  { key: "ui", icon: <Settings className="size-4" /> },
] as const;

const previews = [
  {
    key: "settings",
    src: "/images/patcher/patcher-settings.png",
  },
  {
    key: "relaxRanking",
    src: "/images/patcher/patcher-relax-ranking.png",
  },
  {
    key: "ppCounter",
    src: "/images/patcher/patcher-pp-counter.png",
  },
] as const;

export default function Patcher() {
  const t = useT("pages.patcher");

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<Puzzle />}
        roundBottom={true}
      />

      <div>
        <PrettyHeader text={t("features.title")} icon={<Puzzle />} />
        <RoundedContent>
          <div className="mx-auto flex w-11/12 flex-col space-y-6">
            <Carousel className="w-full">
              <CarouselContent className="-ml-1">
                {previews.map(({ key, src }) => (
                  <CarouselItem
                    key={key}
                    className="pl-0 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card className="scale-95 overflow-hidden border-border/50 pt-0 transition-transform duration-300 hover:scale-100">
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                          <Image
                            src={src}
                            alt={t(`previews.${key}.alt`)}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="mb-1 text-sm font-bold">
                            {t(`previews.${key}.title`)}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {t(`previews.${key}.description`)}
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

            <p className="text-sm">
              {t.rich("description", {
                a: chunks => (
                  <Link
                    href={ORIGINAL_REPO_URL}
                    className="text-primary underline transition-opacity hover:opacity-80"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {featureCategories.map(({ key, icon }) => (
                <Card key={key} className="border-border/50 py-3">
                  <CardHeader className="px-4 py-0">
                    <CardTitle className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="text-muted-foreground">{icon}</span>
                      {t(`featureSummary.${key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-0 pt-1">
                    <CardDescription className="text-xs leading-snug">
                      {t(`featureSummary.${key}.description`)}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button size="lg" asChild className="w-full">
              <Link href={PATCHER_DOWNLOAD_URL}>
                <Download className="size-4" />
                {t("download")}
              </Link>
            </Button>

            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm font-semibold text-destructive">
              <TriangleAlert className="size-5 flex-shrink-0" />
              {t("banchoWarning")}
            </div>
          </div>
        </RoundedContent>
      </div>
    </div>
  );
}
