import bbobHTML from "@bbob/html";
import { BBCodeReactParser } from "@/components/BBCode/BBCodeReactParser";
import {
  allowedTags,
  customBBCodePreset,
} from "@/components/BBCode/BBCodePreset";

export default function BBCodeTextField({ text }: { text: string }) {
  const textWithCustomBreaks = text
    .replaceAll("[br]", "[break]")
    .replaceAll("\n", "[break]");

  const htmlString = bbobHTML(textWithCustomBreaks, customBBCodePreset(), {
    onlyAllowTags: allowedTags,
  }).replace(/className/g, "class");

  return <BBCodeReactParser textHtml={htmlString} />;
}
