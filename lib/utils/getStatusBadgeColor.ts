import { ScoreProcessingStatus } from "@/lib/types/api";

export function getStatusBadgeColor(status: ScoreProcessingStatus): string {
  switch (status) {
    case ScoreProcessingStatus.PENDING:
      return "yellow-500";
    case ScoreProcessingStatus.PROCESSING:
      return "blue-500";
    case ScoreProcessingStatus.FAILED:
      return "red-500";
    default:
      return "muted";
  }
}
