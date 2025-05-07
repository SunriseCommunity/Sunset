"use client";

import { Button } from "@/components/ui/button";
import {
  GameModeToFlagMap,
  GameModeToGameRuleMap,
} from "@/lib/hooks/api/types";
import { useUpdateUserDefaultGamemode } from "@/lib/hooks/api/user/useUserDefaultGamemode";
import useSelf from "@/lib/hooks/useSelf";
import { GameMode, UserResponse } from "@/lib/types/api";

export function SetDefaultGamemodeButton({
  user,
  gamemode,
}: {
  user: UserResponse;
  gamemode: GameMode;
}) {
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
        Set
        <b>
          {` ${GameModeToGameRuleMap[gamemode]} ${GameModeToFlagMap[gamemode]} `}
        </b>
        as profile default game mode
      </span>
    </Button>
  );
}
