"use client";

import {
  BookCopy,
  ChartColumnIncreasing,
  Cog,
  LucideHistory,
  Search,
  UserIcon,
  Users2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import BeatmapsetRowElement from "@/components/BeatmapsetRowElement";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { EosIconsThreeDotsLoading } from "@/components/ui/icons/three-dots-loading";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";

import UserRowElement from "../UserRowElement";

export default function HeaderSearchCommand() {
  const t = useT("components.headerSearchCommand");
  const router = useRouter();
  const { self } = useSelf();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchValue = useDebounce<string>(searchQuery, 450);

  const pagesList = useMemo(
    () => [
      {
        icon: <ChartColumnIncreasing />,
        title: t("pages.leaderboard"),
        url: "/leaderboard",
        filter: "Leaderboard",
      },
      {
        icon: <LucideHistory />,
        title: t("pages.topPlays"),
        url: "/topplays",
        filter: "Top plays",
      },
      {
        icon: <Search />,
        title: t("pages.beatmapsSearch"),
        url: "/beatmaps/search",
        filter: "Beatmaps search",
      },
      {
        icon: <BookCopy />,
        title: t("pages.wiki"),
        url: "/wiki",
        filter: "Wiki",
      },
      {
        icon: <BookCopy />,
        title: t("pages.rules"),
        url: "/rules",
        filter: "Rules",
      },
      {
        icon: <UserIcon />,
        title: t("pages.yourProfile"),
        url: self !== undefined ? `/user/${self.user_id}` : "",
        filter: "Your profile",
        disabled: !self,
      },
      {
        icon: <Users2 />,
        title: t("pages.friends"),
        url: "/friends",
        filter: "Friends",
        disabled: !self,
      },
      {
        icon: <Cog />,
        title: t("pages.settings"),
        url: "/settings",
        filter: "Settings",
        disabled: !self,
      },
    ],
    [t, self],
  );

  const userSearchQuery = useUserSearch(searchValue, 1, 5, {
    keepPreviousData: true,
  });

  const beatmapsetSearchQuery = useBeatmapsetSearch(
    searchValue,
    searchValue === "" ? 0 : 5,
    [
      BeatmapStatusWeb.APPROVED,
      BeatmapStatusWeb.LOVED,
      BeatmapStatusWeb.QUALIFIED,
      BeatmapStatusWeb.RANKED,
    ],
    undefined,
    false,
    {
      refreshInterval: 0,
    },
  );

  const userSearch = userSearchQuery.data;
  const beatmapsetSearch = beatmapsetSearchQuery.data?.flatMap(d => d.sets);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const openPage = (url: string) => {
    setOpen(false);
    setTimeout(() => {
      router.push(url);
    }, 100);
  };

  const filterElement = (value: string) => {
    if (value.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(open => !open)}
        className="smooth-transition size-7 cursor-pointer rounded-md p-1 opacity-40 hover:bg-neutral-600 hover:bg-opacity-25 group-hover:opacity-100"
      >
        <Search />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder={t("placeholder")}
        />
        <DialogTitle />
        <CommandList>
          <CommandGroup heading={t("headings.users")}>
            {userSearchQuery.isLoading && !userSearch ? (
              <div className="flex h-12 w-full justify-center">
                <EosIconsThreeDotsLoading className="text-4xl" />
              </div>
            ) : (
              searchQuery !== ""
              && userSearch?.map(result => (
                <CommandItem
                  key={`user-${result.user_id}}`}
                  onSelect={() => openPage(`/user/${result.user_id}`)}
                >
                  <UserRowElement user={result} />
                </CommandItem>
              ))
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("headings.beatmapsets")}>
            {beatmapsetSearchQuery.isLoading && !beatmapsetSearch ? (
              <div className="flex h-12 w-full justify-center">
                <EosIconsThreeDotsLoading className="text-4xl" />
              </div>
            ) : (
              searchQuery !== ""
              && beatmapsetSearch?.map(result => (
                <CommandItem
                  key={`beatmapset-${result.id}`}
                  className="p-0"
                  onSelect={() => openPage(`/beatmapsets/${result.id}`)}
                >
                  <BeatmapsetRowElement beatmapSet={result} />
                </CommandItem>
              ))
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("headings.pages")}>
            {pagesList.map(page => (
              <CommandItem
                key={page.url}
                onSelect={() => openPage(page.url)}
                disabled={page.disabled}
                className={filterElement(page.filter) ? "hidden" : ""}
              >
                {page.icon}
                <span>{page.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
