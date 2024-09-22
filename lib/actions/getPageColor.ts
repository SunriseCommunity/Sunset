"use client";
import { usePathname } from "next/navigation";
import { tailwindColors } from "@/lib/types/TailwindTypes";

export const routeColors: { [key: string]: keyof typeof tailwindColors } = {
  "/wiki": "green",
  "/leaderboard": "orange",
  "/topplays": "blue",
  "/settings": "purple",
  "/": "gray",
};

// Deprecated: Needs refactoring.
export function getPageColor(): keyof typeof tailwindColors {
  const pathname = usePathname();

  return routeColors[pathname] || "gray";
}
