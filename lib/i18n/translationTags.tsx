import { ReactNode } from "react";

export const tTags = {
  p: (chunks: ReactNode) => <p>{chunks}</p>,
  b: (chunks: ReactNode) => <b className="font-semibold">{chunks}</b>,
  i: (chunks: ReactNode) => <i className="italic">{chunks}</i>,
};
