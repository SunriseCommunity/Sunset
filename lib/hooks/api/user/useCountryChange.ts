import useSWRMutation from "swr/mutation";

import poster from "@/lib/services/poster";
import type { PostUserCountryChangeData } from "@/lib/types/api";

export function useCountryChange() {
  return useSWRMutation(`user/self`, countryChange);
}

async function countryChange(url: string, { arg }: { arg: PostUserCountryChangeData["body"] }) {
  return await poster(`user/country/change`, {
    json: {
      ...arg,
    },
  });
}
