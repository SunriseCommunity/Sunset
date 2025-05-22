import BeatmapsSearch from "@/components/Beatmaps/Search/BeatmapsSearch";
import PrettyHeader from "@/components/General/PrettyHeader";
import { Music2, Search } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
      <BeatmapsSearch />
    </div>
  );
}
