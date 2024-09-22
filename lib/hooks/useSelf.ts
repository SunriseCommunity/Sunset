import { SelfContext } from "@/lib/providers/SelfProvider";
import { useContext } from "react";

export default function useSelf() {
  const context = useContext(SelfContext);
  if (context === undefined) {
    throw new Error("useSelf must be used within a SelfProvider");
  }

  return context;
}
