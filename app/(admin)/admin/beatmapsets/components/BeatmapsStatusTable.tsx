"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BeatmapSetResponse,
  BeatmapStatusWeb,
  GameMode,
} from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { BeatmapStatusSelect } from "@/app/(admin)/admin/beatmapsets/components/BeatmapStatusSelect";
import { Calculator, Undo2 } from "lucide-react";
import { PPCalculatorDialog } from "@/app/(website)/beatmapsets/components/PPCalculatorDialog";
import { BeatmapNominatorUser } from "@/app/(website)/beatmapsets/components/BeatmapNominatorUser";

import { SecondsToString } from "@/lib/utils/secondsTo";
import DifficultyIcon from "@/components/DifficultyIcon";
import Image from "next/image";
import Link from "next/link";
import { useUpdateBeatmapCustomStatus } from "@/lib/hooks/api/beatmap/useUpdateBeatmapCustomStatus";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";
import { Tooltip } from "@/components/Tooltip";
import { BeatmapPerformanceTooltip } from "@/app/(admin)/admin/beatmapsets/components/BeatmapPerformanceTooltip";

export function BeatmapsStatusTable({
  beatmapSet,
}: {
  beatmapSet: BeatmapSetResponse;
}) {
  const [bulkStatus, setBulkStatus] = useState<BeatmapStatusWeb>(
    BeatmapStatusWeb.RANKED
  );

  const [selectedBeatmaps, setSelectedBeatmaps] = useState<string[]>([]);

  const { trigger } = useUpdateBeatmapCustomStatus(beatmapSet.id);

  const handleSelectBeatmap = (beatmapId: string) => {
    setSelectedBeatmaps((prev) =>
      prev.includes(beatmapId)
        ? prev.filter((id) => id !== beatmapId)
        : [...prev, beatmapId]
    );
  };

  const handleUpdateBeatmapStatus = (
    beatmapId: number,
    status?: BeatmapStatusWeb
  ) => {
    trigger({
      ids: [beatmapId],
      status: status ?? BeatmapStatusWeb.UNKNOWN,
    });
  };

  const handleSelectAll = () => {
    const allBeatmapIds = beatmapSet.beatmaps.map((b) => b.id.toString());
    const isAllSelected = allBeatmapIds.every((id) =>
      selectedBeatmaps.includes(id)
    );

    setSelectedBeatmaps((prev) =>
      isAllSelected
        ? prev.filter((id) => !allBeatmapIds.includes(id))
        : [...new Set([...prev, ...allBeatmapIds])]
    );
  };

  const handleBulkStatusChange = (status?: BeatmapStatusWeb) => {
    trigger({
      ids: selectedBeatmaps.map((id) => Number(id)),
      status: status ?? BeatmapStatusWeb.UNKNOWN,
    });

    setSelectedBeatmaps([]);
  };

  const shouldIncludeCircleSize = beatmapSet.beatmaps.some((b) =>
    [GameMode.STANDARD, GameMode.CATCH_THE_BEAT].includes(b.mode)
  );

  const shouldIncludeApproachRate = beatmapSet.beatmaps.some((b) =>
    [GameMode.STANDARD, GameMode.CATCH_THE_BEAT].includes(b.mode)
  );
  return (
    <div className="space-y-4">
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Input placeholder="Search beatmaps..." className="w-[250px]" />
            <Button variant="outline">Search</Button>
          </div>
          {selectedBeatmaps.length > 0 && (
            <div className="flex items-center gap-2">
              <BeatmapStatusSelect
                value={bulkStatus}
                onValueChange={setBulkStatus}
              />

              <Button
                size="icon"
                variant="secondary"
                onClick={() => handleBulkStatusChange()}
              >
                <Undo2 />
              </Button>

              <Button onClick={() => handleBulkStatusChange(bulkStatus)}>
                Update {selectedBeatmaps.length} beatmap(s)
              </Button>
            </div>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={beatmapSet.beatmaps.every((beatmap) =>
                    selectedBeatmaps.includes(beatmap.id.toString())
                  )}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>

              <TableHead>ID</TableHead>
              <TableHead>Hash</TableHead>
              <TableHead>Mapper</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>BPM</TableHead>
              <TableHead>Difficulty</TableHead>
              {shouldIncludeCircleSize && <TableHead>CS</TableHead>}
              <TableHead>HP</TableHead>
              <TableHead>Accuracy</TableHead>
              {shouldIncludeApproachRate && <TableHead>AR</TableHead>}
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
              <TableHead>Edited by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {beatmapSet.beatmaps
              .sort(
                (a, b) =>
                  getBeatmapStarRating(b, b.mode) -
                  getBeatmapStarRating(a, a.mode)
              )
              .sort((a, b) => a.mode_int - b.mode_int)
              .map((beatmap) => {
                const includeCircleSize = [
                  GameMode.STANDARD,
                  GameMode.CATCH_THE_BEAT,
                ].includes(beatmap.mode);

                const includeApproachRate = [
                  GameMode.STANDARD,
                  GameMode.CATCH_THE_BEAT,
                ].includes(beatmap.mode);

                return (
                  <TableRow key={beatmap.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBeatmaps.includes(
                          beatmap.id.toString()
                        )}
                        onCheckedChange={() =>
                          handleSelectBeatmap(beatmap.id.toString())
                        }
                      />
                    </TableCell>
                    <TableCell className="font-mono">{beatmap.id}</TableCell>
                    <TableCell className="font-mono">
                      <span className="bg-accent px-1 rounded">
                        {beatmap.hash.slice(0, 7)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`https://osu.ppy.sh/u/${beatmap.creator_id}`}>
                        <div className="flex gap-1 items-center ">
                          <div className="relative w-4 h-4 overflow-hidden rounded">
                            <Image
                              src={`https://a.ppy.sh/${beatmap.creator_id}`}
                              alt={`${beatmap.creator}'s avatar`}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          <span>{beatmap.creator}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{beatmap.version}</TableCell>
                    <TableCell>
                      {SecondsToString(beatmap.total_length)}
                    </TableCell>
                    <TableCell>{beatmap.bpm}</TableCell>
                    <TableCell>
                      <span
                        className="text-shadow px-0.5"
                        style={{
                          color: `${getStarRatingColor(
                            getBeatmapStarRating(beatmap)
                          )}`,
                        }}
                      >
                        ★
                      </span>
                      {getBeatmapStarRating(beatmap)}
                    </TableCell>

                    {shouldIncludeCircleSize ? (
                      <TableCell>
                        {includeCircleSize ? beatmap.cs : "-"}
                      </TableCell>
                    ) : null}
                    <TableCell>{beatmap.drain ?? 0}</TableCell>
                    <TableCell>{beatmap.accuracy ?? 0}</TableCell>
                    {shouldIncludeApproachRate ? (
                      <TableCell>
                        {includeApproachRate ? beatmap.ar ?? 0 : "-"}
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <DifficultyIcon
                          className="text-xs"
                          iconColor="#FFFFFFF"
                          gameMode={beatmap.mode}
                        />
                        {beatmap.mode}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <BeatmapStatusSelect
                          value={beatmap.status}
                          onValueChange={(s) =>
                            handleUpdateBeatmapStatus(beatmap.id, s)
                          }
                        />
                        {beatmap.beatmap_nominator_user && (
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() =>
                              handleUpdateBeatmapStatus(beatmap.id)
                            }
                          >
                            <Undo2 />
                          </Button>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <PPCalculatorDialog
                          beatmap={beatmap}
                          mode={beatmap.mode}
                        >
                          <Button
                            size="icon"
                            variant="secondary"
                            className="align-middle"
                          >
                            <Calculator />
                          </Button>
                        </PPCalculatorDialog>

                        <BeatmapPerformanceTooltip beatmap={beatmap} />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-nowrap">
                        {beatmap.beatmap_nominator_user ? (
                          <BeatmapNominatorUser
                            user={beatmap.beatmap_nominator_user}
                          />
                        ) : (
                          "No one"
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </>
    </div>
  );
}
