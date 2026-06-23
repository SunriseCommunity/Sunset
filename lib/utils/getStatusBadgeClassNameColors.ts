import { ScoreProcessingStatus } from "@/lib/types/api";

export function getStatusBadgeClassNameColors(status: ScoreProcessingStatus): string {
  switch (status) {
    case ScoreProcessingStatus.PENDING:
      return "bg-yellow-500/15 text-yellow-500";
    case ScoreProcessingStatus.PROCESSING:
      return "bg-blue-500/15 text-blue-500";
    case ScoreProcessingStatus.FAILED:
      return "bg-red-500/15 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}
