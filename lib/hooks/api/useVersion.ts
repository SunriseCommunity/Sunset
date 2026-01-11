"use client";

import useSWR from "swr";

import type { GetVersionResponse } from "@/lib/types/api";

export function useVersion() {
  return useSWR<GetVersionResponse>(
    "version",
  );
}
