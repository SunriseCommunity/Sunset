import type { KyResponse } from "ky";
import useSWR from "swr";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import fetcher from "@/lib/services/fetcher";

export function useDownloadReplay(scoreId: number) {
  const { data: userSelf } = useUserSelf();

  const { data, error, isLoading, mutate } = useSWR(
    userSelf ? `score/${scoreId}/replay` : null,
    url => fetchReplay(url),
  );

  const downloadReplay = () => {
    if (!data)
      return;

    const { blob, filename } = data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    replayData: data,
    error,
    isLoading,
    downloadReplay,
    refetch: mutate,
  };
}

async function fetchReplay(url: string) {
  const response = await fetcher<KyResponse<null>>(url).catch(() => null);

  if (!response) {
    throw new Error("Couldn't download replay");
  }

  const blob = await response.blob();

  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `replay.osr`;

  if (contentDisposition) {
    const match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
    if (match && match[1]) {
      filename = decodeURI(match[1]);
    }
  }

  return { blob, filename };
}
