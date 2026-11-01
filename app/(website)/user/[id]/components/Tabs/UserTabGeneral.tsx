import { HistoryIcon, User2 } from "lucide-react";

import UserPlayHistoryChart from "@/app/(website)/user/[id]/components/UserPlayHistoryChart";
import BBCodeTextField from "@/components/BBCode/BBCodeTextField";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useUserPlayHistoryGraph } from "@/lib/hooks/api/user/useUserPlayHistoryGraph";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse } from "@/lib/types/api";

interface UserTabGeneralProps {
  user: UserResponse;
}

export default function UserTabGeneral({ user }: UserTabGeneralProps) {
  const t = useT("pages.user.components.generalTab");

  const userPlayHistoryGraphQuery = useUserPlayHistoryGraph(user.user_id);
  const userPlayHistoryGraph = userPlayHistoryGraphQuery.data;

  const hasDescription = Boolean(user.description?.length);

  return (
    <div className="flex flex-col gap-4">
      {hasDescription && (
        <div className="flex flex-col">
          <PrettyHeader text={t("aboutMe")} icon={<User2 />} />
          <RoundedContent className="h-fit min-h-0">
            <div className="max-h-96 overflow-y-auto">
              <BBCodeTextField text={user.description ?? ""} />
            </div>
          </RoundedContent>
        </div>
      )}

      {userPlayHistoryGraph && userPlayHistoryGraph.snapshots.length > 0 && (
        <div className="flex flex-col">
          <PrettyHeader text={t("playHistory")} icon={<HistoryIcon />} />
          <RoundedContent className="h-fit min-h-0">
            <UserPlayHistoryChart data={userPlayHistoryGraph} />
          </RoundedContent>
        </div>
      )}
    </div>
  );
}
