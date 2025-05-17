import BeatmapsSearch from "@/components/Beatmaps/Search/BeatmapsSearch";
import PrettyHeader from "@/components/General/PrettyHeader";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader text="Beatmaps search" roundBottom icon={<Search />} />
      <BeatmapsSearch forceThreeGridCols={true} />
    </div>
  );
}
