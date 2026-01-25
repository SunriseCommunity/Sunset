"use client";

import type { HTTPError } from "ky";
import { useEffect, useRef } from "react";
import type { SWRResponse } from "swr";

import { useToast } from "@/hooks/use-toast";

import type { ProblemDetailsResponseType } from "../types/api";

export function useToastApiRequestFailed<T>(swrResult: SWRResponse<T>) {
  const { toast } = useToast();
  const lastErrorRef = useRef<Error | null>(null);

  useEffect(() => {
    const { error } = swrResult;

    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;

      if (error instanceof Error && "response" in error) {
        const httpError = error as HTTPError;

        if (httpError.response?.status && httpError.response.status >= 404) {
          try {
            const problemDetails = JSON.parse(httpError.message) as ProblemDetailsResponseType;

            if (!problemDetails.detail)
              throw new Error("No detail in problem details response");

            toast({
              title: "Error",
              description: problemDetails.detail,
              variant: "destructive",
            });
          }
          catch {
            // Ignore the error if it's not a ProblemDetailsResponseType
          }
        }
      }
    }

    if (!error && lastErrorRef.current) {
      lastErrorRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only need to react to error changes
  }, [swrResult.error, toast]);
}
