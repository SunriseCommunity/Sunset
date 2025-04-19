import { GameMode } from "@/lib/hooks/api/types";

export interface ScoreState {
  /**
   * Maximum combo that the score has had so far. **Not** the maximum
   * possible combo of the map so far.
   *
   * Note that for osu!catch only fruits and droplets are considered for
   * combo.
   *
   * Irrelevant for osu!mania.
   */
  maxCombo?: number;

  /**
   * "Large tick" hits for osu!standard.
   *
   * The meaning depends on the kind of score:
   * - if set on osu!stable, this field is irrelevant and can be `0`
   * - if set on osu!lazer *without* `CL`, this field is the amount of hit
   *   slider ticks and repeats
   * - if set on osu!lazer *with* `CL`, this field is the amount of hit
   *   slider heads, ticks, and repeats
   */
  osuLargeTickHits?: number;

  /**
   * "Small tick" hits for osu!standard.
   *
   * These are essentially the slider end hits for lazer scores without
   * slider accuracy.
   *
   * Only relevant for osu!lazer.
   */
  osuSmallTickHits?: number;

  /**
   * Amount of successfully hit slider ends.
   *
   * Only relevant for osu!standard in lazer.
   */
  sliderEndHits?: number;

  /**
   * Amount of current gekis (n320 for osu!mania).
   */
  nGeki?: number;
  /**
   * Amount of current katus (tiny droplet misses for osu!catch / n200 for
   * osu!mania).
   */
  nKatu?: number;
  /**
   * Amount of current 300s (fruits for osu!catch).
   */
  n300?: number;
  /**
   * Amount of current 100s (droplets for osu!catch).
   */
  n100?: number;
  /**
   * Amount of current 50s (tiny droplets for osu!catch).
   */
  n50?: number;
  /**
   * Amount of current misses (fruits + droplets for osu!catch).
   */
  misses?: number;
}

export interface PerformanceAttributes {
  /**
   * The difficulty attributes.
   */
  readonly difficulty: DifficultyAttributes;
  /**
   * The hitresult score state that was used for performance calculation.
   *
   * Only available if *not* created through gradual calculation.
   */
  readonly state: ScoreState | undefined;
  /**
   * The final performance points.
   */
  readonly pp: number;
  /**
   * The aim portion of the final pp.
   *
   * Only available for osu!.
   */
  readonly ppAim: number | undefined;
  /**
   * The flashlight portion of the final pp.
   *
   * Only available for osu!.
   */
  readonly ppFlashlight: number | undefined;
  /**
   * The speed portion of the final pp.
   *
   * Only available for osu!.
   */
  readonly ppSpeed: number | undefined;
  /**
   * The accuracy portion of the final pp.
   *
   * Only available for osu! and osu!taiko.
   */
  readonly ppAccuracy: number | undefined;
  /**
   * Scaled miss count based on total hits.
   *
   * Only available for osu! and osu!taiko.
   */
  readonly effectiveMissCount: number | undefined;
  /**
   * Upper bound on the player's tap deviation.
   *
   * Only *optionally* available for osu!taiko.
   */
  readonly estimatedUnstableRate: number | undefined;
  /**
   * Approximated unstable-rate
   *
   * Only *optionally* available for osu!.
   */
  readonly speedDeviation: number | undefined;
  /**
   * The strain portion of the final pp.
   *
   * Only available for osu!taiko and osu!mania.
   */
  readonly ppDifficulty: number | undefined;
}

export interface DifficultyAttributes {
  /**
   * The attributes' gamemode.
   */
  readonly mode: GameMode;
  /**
   * The final star rating.
   */
  readonly stars: number;
  /**
   * Whether the map was a convert i.e. an osu! map.
   */
  readonly isConvert: boolean;
  /**
   * The difficulty of the aim skill.
   *
   * Only available for osu!.
   */
  readonly aim: number | undefined;
  /**
   * The number of sliders weighted by difficulty.
   *
   * Only available for osu!.
   */
  readonly aimDifficultSliderCount: number | undefined;
  /**
   * The difficulty of the speed skill.
   *
   * Only available for osu!.
   */
  readonly speed: number | undefined;
  /**
   * The difficulty of the flashlight skill.
   *
   * Only available for osu!.
   */
  readonly flashlight: number | undefined;
  /**
   * The ratio of the aim strain with and without considering sliders
   *
   * Only available for osu!.
   */
  readonly sliderFactor: number | undefined;
  /**
   * The number of clickable objects weighted by difficulty.
   *
   * Only available for osu!.
   */
  readonly speedNoteCount: number | undefined;
  /**
   * Weighted sum of aim strains.
   *
   * Only available for osu!.
   */
  readonly aimDifficultStrainCount: number | undefined;
  /**
   * Weighted sum of speed strains.
   *
   * Only available for osu!.
   */
  readonly speedDifficultStrainCount: number | undefined;
  /**
   * The health drain rate.
   *
   * Only available for osu!.
   */
  readonly hp: number | undefined;
  /**
   * The amount of circles.
   *
   * Only available for osu!.
   */
  readonly nCircles: number | undefined;
  /**
   * The amount of sliders.
   *
   * Only available for osu!.
   */
  readonly nSliders: number | undefined;
  /**
   * The amount of "large ticks".
   *
   * The meaning depends on the kind of score:
   * - if set on osu!stable, this value is irrelevant
   * - if set on osu!lazer *with* slider accuracy, this value is the amount
   *   of hit slider ticks and repeats
   * - if set on osu!lazer *without* slider accuracy, this value is the
   *   amount of hit slider heads, ticks, and repeats
   *
   * Only available for osu!.
   */
  readonly nLargeTicks: number | undefined;
  /**
   * The amount of spinners.
   *
   * Only available for osu!.
   */
  readonly nSpinners: number | undefined;
  /**
   * The difficulty of the stamina skill.
   *
   * Only available for osu!taiko.
   */
  readonly stamina: number | undefined;
  /**
   * The difficulty of the rhythm skill.
   *
   * Only available for osu!taiko.
   */
  readonly rhythm: number | undefined;
  /**
   * The difficulty of the color skill.
   *
   * Only available for osu!taiko.
   */
  readonly color: number | undefined;
  /**
   * The difficulty of the reading skill.
   *
   * Only available for osu!taiko.
   */
  readonly reading: number | undefined;
  /**
   * The amount of fruits.
   *
   * Only available for osu!catch.
   */
  readonly nFruits: number | undefined;
  /**
   * The amount of droplets.
   *
   * Only available for osu!catch.
   */
  readonly nDroplets: number | undefined;
  /**
   * The amount of tiny droplets.
   *
   * Only available for osu!catch.
   */
  readonly nTinyDroplets: number | undefined;
  /**
   * The amount of hitobjects in the map.
   *
   * Only available for osu!mania.
   */
  readonly nObjects: number | undefined;
  /**
   * The amount of hold notes in the map.
   *
   * Only available for osu!mania.
   */
  readonly nHoldNotes: number | undefined;
  /**
   * The approach rate.
   *
   * Only available for osu! and osu!catch.
   */
  readonly ar: number | undefined;
  /**
   * The perceived hit window for an n300 inclusive of rate-adjusting mods
   * (DT/HT/etc)
   *
   * Only available for osu! and osu!taiko.
   */
  readonly greatHitWindow: number | undefined;
  /**
   * The perceived hit window for an n100 inclusive of rate-adjusting mods
   * (DT/HT/etc)
   *
   * Only available for osu! and osu!taiko.
   */
  readonly okHitWindow: number | undefined;
  /**
   * The perceived hit window for an n50 inclusive of rate-adjusting mods
   * (DT/HT/etc)
   *
   * Only available for osu!.
   */
  readonly mehHitWindow: number | undefined;
  /**
   * The ratio of stamina difficulty from mono-color (single color) streams to total
   * stamina difficulty.
   *
   * Only available for osu!taiko.
   */
  readonly monoStaminaFactor: number | undefined;
  /**
   * Return the maximum combo.
   */
  readonly maxCombo: number;
}
