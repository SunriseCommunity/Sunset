import { RestrictionContext } from "@/lib/providers/RestrictionProvider";
import { useContext } from "react";

export default function useRestriction() {
  const context = useContext(RestrictionContext);
  if (context === undefined) {
    throw new Error("useRestriction must be used within a RestrictionProvider");
  }

  return context;
}
