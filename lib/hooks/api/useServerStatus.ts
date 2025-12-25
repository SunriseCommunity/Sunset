"use client";

import useSWR from "swr";

import type { GetStatusResponse } from "@/lib/types/api";

export function useServerStatus() {
  return useSWR<GetStatusResponse>(
    "status?detailed=true&includeRecentUsers=true",
  );
}
