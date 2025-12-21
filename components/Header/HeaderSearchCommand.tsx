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
import { useEffect, useState, useMemo } from "react";
import UserRowElement from "../UserRowElement";
import useDebounce from "@/lib/hooks/useDebounce";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@/components/ui/dialog";
import useSelf from "@/lib/hooks/useSelf";
import { EosIconsThreeDotsLoading } from "@/components/ui/icons/three-dots-loading";
import { Button } from "@/components/ui/button";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import BeatmapsetRowElement from "@/components/BeatmapsetRowElement";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { useT } from "@/lib/i18n/utils";

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
        url: self != undefined ? `/user/${self.user_id}` : "",
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
    [t, self]
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
    }
  );

  const userSearch = userSearchQuery.data;
  const beatmapsetSearch = beatmapsetSearchQuery.data?.flatMap((d) => d.sets);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
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
    if (value.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((open) => !open)}
        className="hover:bg-neutral-600 hover:bg-opacity-25 p-1 h-7 w-7 rounded-md cursor-pointer smooth-transition opacity-40 group-hover:opacity-100"
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
              <div className="flex justify-center h-12 w-full">
                <EosIconsThreeDotsLoading className="text-4xl" />
              </div>
            ) : (
              searchQuery != "" &&
              userSearch?.map((result, index) => (
                <CommandItem
                  key={index}
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
              <div className="flex justify-center h-12 w-full">
                <EosIconsThreeDotsLoading className="text-4xl" />
              </div>
            ) : (
              searchQuery != "" &&
              beatmapsetSearch?.map((result, index) => (
                <CommandItem
                  key={index}
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
            {pagesList.map((page) => (
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
