import { ScoreProcessingStatus } from "@/lib/types/api";

const STATUS_BADGE_CLASSES: Partial<Record<ScoreProcessingStatus, { badge: string; text: string }>> = {
  [ScoreProcessingStatus.PENDING]: {
    badge: "bg-yellow-500/15 text-yellow-500",
    text: "text-yellow-500",
  },
  [ScoreProcessingStatus.PROCESSING]: {
    badge: "bg-blue-500/15 text-blue-500",
    text: "text-blue-500",
  },
  [ScoreProcessingStatus.FAILED]: {
    badge: "bg-red-500/15 text-red-500",
    text: "text-red-500",
  },
};

export function getStatusBadgeClassName(status: ScoreProcessingStatus): string {
  return STATUS_BADGE_CLASSES[status]?.badge ?? "bg-muted text-muted-foreground";
}

export function getStatusBadgeTextClassName(status: ScoreProcessingStatus): string {
  return STATUS_BADGE_CLASSES[status]?.text ?? "text-muted-foreground";
}
