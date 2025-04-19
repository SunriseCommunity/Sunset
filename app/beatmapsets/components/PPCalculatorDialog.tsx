import { ModsSelector } from "@/app/beatmapsets/components/leaderboard/ModsSelector";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EosIconsThreeDotsLoading } from "@/components/ui/icons/three-dots-loading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WorkInProgress } from "@/components/WorkInProgress";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { useBeatmamPp } from "@/lib/hooks/api/beatmap/useBeatmamPp";
import { ShortenedMods } from "@/lib/hooks/api/score/types";
import { GameMode } from "@/lib/hooks/api/types";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import numberWith from "@/lib/utils/numberWith";
import { SecondsToString } from "@/lib/utils/secondsTo";
import { tryParseNumber } from "@/lib/utils/type.util";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock9, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  accuracy: z.coerce
    .number()
    .min(0, {
      message: "Accuracy can't be negative",
    })
    .max(100, {
      message: "Accuracy can't be greater that 100",
    }),
  combo: z.coerce.number().int().min(0, {
    message: "Combo can't be negative",
  }),
  misses: z.coerce.number().int().min(0, {
    message: "Misses can't be negative",
  }),
});

export function PPCalculatorDialog({
  beatmap,
  mode,
  children,
}: {
  beatmap: Beatmap;
  mode: GameMode;
  children: React.ReactNode;
}) {
  const defaultValues = {
    accuracy: 100.0,
    combo: beatmap.max_combo,
    misses: 0,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [mods, setMods] = useState<string[]>([]);

  const [scoreAttributes, setScoreAttributes] = useState<{
    accuracy?: number;
    combo?: number;
    misses?: number;
    mods?: number;
  }>(defaultValues);

  const { data, error } = useBeatmamPp(
    beatmap.id,
    mode,
    scoreAttributes.mods,
    scoreAttributes.combo,
    scoreAttributes.misses,
    scoreAttributes.accuracy,
    { keepPreviousData: true }
  );

  const performanceResult = data;

  const beatmapLength = mods.includes(ShortenedMods.DT.toString())
    ? Math.floor(beatmap.total_length / 1.5)
    : mods.includes(ShortenedMods.HT.toString())
    ? Math.floor(beatmap.total_length * 1.33)
    : beatmap.total_length;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { accuracy, combo, misses } = values;

    const selectedMods =
      mods.length == 0
        ? ""
        : mods.reduce((v, c) => (Number(v ?? 0) + Number(c ?? 0)).toString());

    setScoreAttributes({
      accuracy,
      combo,
      misses,
      mods: tryParseNumber(selectedMods),
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>PP Calculator</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <RoundedContent className="rounded-lg flex place-content-between ">
          {performanceResult ? (
            <>
              <p>
                PP:{" "}
                <span className="text-primary font-bold">
                  ~{numberWith(performanceResult?.pp.toFixed(2), ",")}
                </span>
              </p>

              <Tooltip content="Total Length">
                <p className="flex items-center text-sm">
                  <Clock9 className="h-4" />
                  <span className="text-primary font-bold">
                    {SecondsToString(beatmapLength)}
                  </span>
                </p>
              </Tooltip>

              <p className="flex items-center text-sm">
                <Star className="h-4" />
                <span className="text-primary font-bold">
                  {performanceResult?.difficulty.stars.toFixed(2)}
                </span>
              </p>
            </>
          ) : (
            <EosIconsThreeDotsLoading className="h-6 w-6 mx-auto" />
          )}
        </RoundedContent>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="accuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accuracy</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="combo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combo</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="misses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Misses</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <ModsSelector
              mods={mods}
              setMods={setMods}
              variant="big"
              className="bg-transparent border-none shadow-none p-0"
              ignoreMods={[
                ShortenedMods.NM,
                ShortenedMods.SD,
                ShortenedMods.PF,
                ShortenedMods.NC,
              ]}
            />

            <Separator className="my-2" />
            {error && (
              <p className="text-sm text-center text-destructive">
                {error?.message ?? "Unknown error"}
              </p>
            )}
            <DialogFooter>
              <Button className="w-full" type="submit">
                Calculate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
