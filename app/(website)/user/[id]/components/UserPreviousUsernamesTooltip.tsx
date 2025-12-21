import { Tooltip } from "@/components/Tooltip";

import { ChevronDown, IdCard } from "lucide-react";
import { twMerge } from "tailwind-merge";
import React from "react";
import { UserResponse } from "@/lib/types/api";
import { useUserPreviousUsernames } from "@/lib/hooks/api/user/useUserPreviousUsernames";
import { useT } from "@/lib/i18n/utils";

interface UserPreviousUsernamesTooltipProps {
  user: UserResponse;
  className?: string;
}

export default function UserPreviousUsernamesTooltip({
  user,
  className,
}: UserPreviousUsernamesTooltipProps) {
  const t = useT("pages.user.components.previousUsernames");
  const userPreviousUsernamesResult = useUserPreviousUsernames(user.user_id);

  if (
    !userPreviousUsernamesResult.data ||
    userPreviousUsernamesResult.error ||
    userPreviousUsernamesResult.data.usernames.length === 0
  )
    return null;

  return (
    <div className={twMerge("flex flex-wrap gap-1", className)}>
      <Tooltip
        content={
          <div>
            <p>{t("previouslyKnownAs")}</p>
            {
              <ul className="list-disc pl-5">
                {userPreviousUsernamesResult.data.usernames.map(
                  (username, i) => (
                    <li key={i}>{username}</li>
                  )
                )}
              </ul>
            }
          </div>
        }
      >
        <ChevronDown
          className={`flex text-current items-center text-xs p-0.5 hover:scale-105 smooth-transition`}
        />
      </Tooltip>
    </div>
  );
}
