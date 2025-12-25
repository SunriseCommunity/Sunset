import { Music2 } from "lucide-react";

import BeatmapsSearch from "@/components/Beatmaps/Search/BeatmapsSearch";
import PrettyHeader from "@/components/General/PrettyHeader";

export default function Page() {
  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
      <BeatmapsSearch />
    </div>
  );
}
