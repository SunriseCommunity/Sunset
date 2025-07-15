import poster from "@/lib/services/poster";
import { PostUserCountryChangeData } from "@/lib/types/api";
import useSWRMutation from "swr/mutation";

export function useCountryChange() {
  return useSWRMutation(`user/self`, countryChange);
}

const countryChange = async (
  url: string,
  { arg }: { arg: PostUserCountryChangeData["body"] }
) => {
  return await poster(`user/country/change`, {
    json: {
      ...arg,
    },
  });
};
