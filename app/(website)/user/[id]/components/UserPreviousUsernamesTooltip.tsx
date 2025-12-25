import { ChevronDown } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

import { Tooltip } from "@/components/Tooltip";
import { useUserPreviousUsernames } from "@/lib/hooks/api/user/useUserPreviousUsernames";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse } from "@/lib/types/api";

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
    !userPreviousUsernamesResult.data
    || userPreviousUsernamesResult.error
    || userPreviousUsernamesResult.data.usernames.length === 0
  ) {
    return null;
  }

  return (
    <div className={twMerge("flex flex-wrap gap-1", className)}>
      <Tooltip
        content={(
          <div>
            <p>{t("previouslyKnownAs")}</p>
            <ul className="list-disc pl-5">
              {userPreviousUsernamesResult.data.usernames.map(
                (username, i) => (
                  // eslint-disable-next-line @eslint-react/no-array-index-key -- would actually prefer to use index here
                  <li key={`previous-username-${username}-${i}`}>{username}</li>
                ),
              )}
            </ul>
          </div>
        )}
      >
        <ChevronDown
          className="smooth-transition flex items-center p-0.5 text-xs text-current hover:scale-105"
        />
      </Tooltip>
    </div>
  );
}
