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
import { useEffect, useState } from "react";
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

export default function HeaderSearchCommand() {
  const router = useRouter();
  const { self } = useSelf();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchValue = useDebounce<string>(searchQuery, 450);

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
          placeholder="Type to search..."
        />
        <DialogTitle />
        <CommandList>
          <CommandGroup heading="Users">
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
          <CommandGroup heading="Beatmapsets">
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
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() => openPage("/leaderboard")}
              className={filterElement("Leaderboard") ? "hidden" : ""}
            >
              <ChartColumnIncreasing />
              <span>Leaderboard</span>
            </CommandItem>

            <CommandItem
              onSelect={() => openPage("/topplays")}
              className={filterElement("Top plays") ? "hidden" : ""}
            >
              <LucideHistory />
              <span>Top plays</span>
            </CommandItem>

            <CommandItem
              onSelect={() => openPage("/beatmaps/search")}
              className={filterElement("Beatmaps search") ? "hidden" : ""}
            >
              <Search />
              <span>Beatmaps search</span>
            </CommandItem>

            <CommandItem
              onSelect={() => openPage("/wiki")}
              className={filterElement("Wiki") ? "hidden" : ""}
            >
              <BookCopy />
              <span>Wiki</span>
            </CommandItem>

            <CommandItem
              onSelect={() => openPage("/rules")}
              className={filterElement("Rules") ? "hidden" : ""}
            >
              <BookCopy />
              <span>Rules</span>
            </CommandItem>

            <CommandItem
              onSelect={() =>
                openPage(self != undefined ? `/user/${self.user_id}` : "")
              }
              disabled={!self}
              className={filterElement("Your profile") ? "hidden" : ""}
            >
              <UserIcon />
              <span>Your profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => openPage("/friends")}
              disabled={!self}
              className={filterElement("Friends") ? "hidden" : ""}
            >
              <Users2 />
              <span>Friends</span>
            </CommandItem>
            <CommandItem
              onSelect={() => openPage("/settings")}
              disabled={!self}
              className={filterElement("Settings") ? "hidden" : ""}
            >
              <Cog />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
