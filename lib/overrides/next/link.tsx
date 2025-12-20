import NextLink from "next/dist/client/link";
import { ComponentPropsWithRef } from "react";

/*
 * ! Using prefetched pages omits their metadata, which causes pages to miss titles/descriptions.
 * ! Therefore, we disable prefetching for all links by default.
 */

const Link = (props: ComponentPropsWithRef<typeof NextLink>) => (
  <NextLink prefetch={false} {...props} />
);

export default Link;
