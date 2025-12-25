import NextLink from "next/dist/client/link";
import type { ComponentPropsWithRef } from "react";

/*
 * ! Using prefetched pages omits their metadata, which causes pages to miss titles/descriptions.
 * ! Therefore, we disable prefetching for all links by default.
 */

function Link(props: ComponentPropsWithRef<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}

export default Link;
