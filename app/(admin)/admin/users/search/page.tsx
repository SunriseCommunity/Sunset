import PrettyHeader from "@/components/General/PrettyHeader";
import { Users } from "lucide-react";
import UsersSearch from "@/app/(admin)/admin/users/components/UsersSearch";

export default function Page() {
  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Users search" roundBottom icon={<Users />} />
      <UsersSearch />
    </div>
  );
}

