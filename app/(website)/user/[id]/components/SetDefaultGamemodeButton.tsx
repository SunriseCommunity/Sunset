"use client";

import { Button } from "@/components/ui/button";
import {
  GameModeToFlagMap,
  GameModeToGameRuleMap,
} from "@/lib/hooks/api/types";
import { useUpdateUserDefaultGamemode } from "@/lib/hooks/api/user/useUserDefaultGamemode";
import useSelf from "@/lib/hooks/useSelf";
import { GameMode, UserResponse } from "@/lib/types/api";
import { useT } from "@/lib/i18n/utils";

export function SetDefaultGamemodeButton({
  user,
  gamemode,
}: {
  user: UserResponse;
  gamemode: GameMode;
}) {
  const t = useT("pages.user");
  const { self } = useSelf();

  const { trigger } = useUpdateUserDefaultGamemode();

  const updateDefaultGamemode = (default_gamemode: GameMode) => {
    trigger({ default_gamemode, user: user });
  };

  const isCurrentUserSelf = user.user_id === self?.user_id;
  const isGamemodeAlreadyDefault = user.default_gamemode === gamemode;

  if (!self || !isCurrentUserSelf || isGamemodeAlreadyDefault) return;

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        updateDefaultGamemode(gamemode);
      }}
      className="hidden md:inline"
      size="sm"
      variant={"secondary"}
    >
      <span>
        {t.rich("buttons.setDefaultGamemode", {
          gamemode: GameModeToGameRuleMap[gamemode] || "Unknown",
          flag: GameModeToFlagMap[gamemode] || "Unknown",
          b: (chunks) => <b>{chunks}</b>,
        })}
      </span>
    </Button>
  );
}
