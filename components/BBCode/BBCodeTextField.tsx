import bbobHTML from "@bbob/html";

import {
  allowedTags,
  customBBCodePreset,
} from "@/components/BBCode/BBCodePreset";
import { BBCodeReactParser } from "@/components/BBCode/BBCodeReactParser";

export default function BBCodeTextField({ text }: { text: string }) {
  const textWithCustomBreaks = text
    .replaceAll("[br]", "[break]")
    .replaceAll("\n", "[break]");

  const htmlString = bbobHTML(textWithCustomBreaks, customBBCodePreset(), {
    onlyAllowTags: allowedTags,
  }).replaceAll("className", "class");

  return <BBCodeReactParser textHtml={htmlString} />;
}
