import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BeatmapStatusWeb } from "@/lib/types/api";

export function BeatmapStatusSelect({
  value,
  onValueChange,
}: {
  value: BeatmapStatusWeb;
  onValueChange: (status: BeatmapStatusWeb) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Change status" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(BeatmapStatusWeb)
          .filter(v => v !== BeatmapStatusWeb.UNKNOWN)
          .map((v) => {
            return (
              <SelectItem key={`beatmap-status-select-${v}`} value={v}>
                {v}
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>
  );
}
