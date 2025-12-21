import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useSelf from "@/lib/hooks/useSelf";
import {
  BookCopy,
  ChartColumnIncreasing,
  Cog,
  DoorOpen,
  Heart,
  Home,
  LucideHistory,
  Menu,
  MonitorCog,
  Search,
  UserIcon,
  Users2,
  UsersRoundIcon,
} from "lucide-react";
import HeaderSearchCommand from "@/components/Header/HeaderSearchCommand";
import { ThemeModeToggle } from "@/components/Header/ThemeModeToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  createContext,
  Dispatch,
  SetStateAction,
  Suspense,
  useState,
  useMemo,
} from "react";
import Image from "next/image";
import { HeaderLogoutAlert } from "@/components/Header/HeaderLogoutAlert";
import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import { isUserCanUseAdminPanel } from "@/lib/utils/userPrivileges.util";
import { useT } from "@/lib/i18n/utils";
import { LanguageSelector } from "@/components/Header/LanguageSelector";

export const MobileDrawerContext = createContext<Dispatch<
  SetStateAction<boolean>
> | null>(null);

export default function HeaderMobileDrawer() {
  const t = useT("components.headerMobileDrawer");
  const [open, setOpen] = useState(false);

  const { self } = useSelf();

  const navigationList = useMemo(() => {
    const list = [
      {
        icon: <Home />,
        title: t("navigation.home"),
        url: "/",
      },
      {
        icon: <ChartColumnIncreasing />,
        title: t("navigation.leaderboard"),
        url: "/leaderboard",
      },
      {
        icon: <LucideHistory />,
        title: t("navigation.topPlays"),
        url: "/topplays",
      },
      {
        icon: <Search />,
        title: t("navigation.beatmapsSearch"),
        url: "/beatmaps/search",
      },
      {
        icon: <BookCopy />,
        title: t("navigation.wiki"),
        url: "/wiki",
      },
      {
        icon: <BookCopy />,
        title: t("navigation.rules"),
        url: "/rules",
      },
      {
        icon: <BookCopy />,
        title: t("navigation.apiDocs"),
        url: `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/docs`,
      },
    ];

    if (process.env.NEXT_PUBLIC_DISCORD_LINK) {
      list.push({
        icon: <UsersRoundIcon />,
        title: t("navigation.discordServer"),
        url: process.env.NEXT_PUBLIC_DISCORD_LINK,
      });
    }

    if (
      process.env.NEXT_PUBLIC_KOFI_LINK ||
      process.env.NEXT_PUBLIC_BOOSTY_LINK
    ) {
      list.push({
        icon: <Heart />,
        title: t("navigation.supportUs"),
        url: "/support",
      });
    }

    return list;
  }, [t]);

  return (
    <MobileDrawerContext.Provider value={setOpen}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <Menu />
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <div className="flex w-full items-center place-content-between">
              {self ? (
                <DrawerClose asChild>
                  <Link
                    className="flex items-center flex-grow min-w-0"
                    href={`/user/${self.user_id}`}
                  >
                    <Avatar className="cursor-pointer smooth-transition">
                      <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                        <Image
                          src={self.avatar_url}
                          width={64}
                          height={64}
                          alt="Avatar"
                        />
                      </Suspense>
                    </Avatar>
                    <p className="block truncate mx-2 font-medium">
                      {self.username}
                    </p>
                  </Link>
                </DrawerClose>
              ) : (
                <HeaderLoginDialog />
              )}
              <div className="flex-shrink-0 scale-125 ">
                <HeaderSearchCommand />
                <ThemeModeToggle />
                <LanguageSelector />
              </div>
            </div>
          </DrawerHeader>

          <DrawerFooter>
            <ScrollArea className="h-72 rounded-md bg-transparent">
              <div className="space-y-3 mb-8">
                {self && (
                  <>
                    <DrawerClose asChild>
                      <Link
                        href={`/user/${self.user_id}`}
                        className="flex space-x-2"
                      >
                        <UserIcon />
                        <p>{t("yourProfile")}</p>
                      </Link>
                    </DrawerClose>
                    <Separator className="my-2" />
                    <DrawerClose asChild>
                      <Link href={`/friends`} className="flex space-x-2">
                        <Users2 />
                        <p>{t("friends")}</p>
                      </Link>
                    </DrawerClose>
                    <Separator className="my-2" />
                    <DrawerClose asChild>
                      <Link href={`/settings`} className="flex space-x-2">
                        <Cog />
                        <p>{t("settings")}</p>
                      </Link>
                    </DrawerClose>
                    {isUserCanUseAdminPanel(self) && (
                      <>
                        <Separator className="my-2" />

                        <DrawerClose asChild>
                          <Link href={`/admin`} className="flex space-x-2">
                            <MonitorCog />
                            <p>{t("adminPanel")}</p>
                          </Link>
                        </DrawerClose>
                      </>
                    )}
                    <Separator className="my-2" />
                    <HeaderLogoutAlert className="w-full">
                      <div className="flex space-x-2">
                        <DoorOpen />
                        <p>{t("logOut")}</p>
                      </div>
                    </HeaderLogoutAlert>
                    <Separator className="my-2" />
                  </>
                )}
              </div>

              <div className="space-y-3">
                {navigationList.map((tag) => (
                  <div key={tag.title}>
                    <DrawerClose asChild>
                      <Link href={tag.url} className="flex space-x-2">
                        {tag.icon}
                        <p>{tag.title}</p>
                      </Link>
                    </DrawerClose>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </MobileDrawerContext.Provider>
  );
}
