import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { WorkInProgress } from "@/components/WorkInProgress";
import { Construction } from "lucide-react";

interface UserTabWIPProps {
  tabName: string;
}

export default function UserTabWIP({ tabName }: UserTabWIPProps) {
  return (
    <div>
      <PrettyHeader icon={<Construction />} text={tabName} />
      <RoundedContent>
        <WorkInProgress />
      </RoundedContent>
    </div>
  );
}
