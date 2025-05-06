"use client";

import { GetStatusResponse } from "@/lib/types/api";
import useSWR from "swr";

export function useServerStatus() {
  return useSWR<GetStatusResponse>(
    "status?detailed=true&includeRecentUsers=true"
  );
}
