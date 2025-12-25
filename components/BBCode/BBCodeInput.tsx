"use client";

import {
  BoldIcon,
  Box,
  CloudUpload,
  Heading,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Map,
  Strikethrough,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import BBCodeTextField from "@/components/BBCode/BBCodeTextField";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface BBCodeInputProps {
  onSave: (text: string) => void;
  isSaving?: boolean;
  defaultText?: string;
}

const formatorsArray = [
  {
    icon: <BoldIcon />,
    text: "Bold",
    format: {
      start: "[b]",
      end: "[/b]",
    },
  },
  {
    icon: <Italic />,
    text: "Italic",
    format: {
      start: "[i]",
      end: "[/i]",
    },
  },
  {
    icon: <Strikethrough />,
    text: "Strike Out",
    format: {
      start: "[s]",
      end: "[/s]",
    },
  },
  {
    icon: <Heading />,
    text: "Header",
    format: {
      start: "[heading]",
      end: "[/heading]",
    },
  },
  {
    icon: <LinkIcon />,
    text: "Link",
    format: {
      start: "[url]",
      end: "[/url]",
    },
  },
  {
    icon: <Box />,
    text: "Box",
    format: {
      start: "[box=]",
      end: "[/box]",
    },
  },
  {
    icon: <ListOrdered />,
    text: "Numbered List",
    format: {
      start: "[list=1]\n[*]",
      end: "[/list]",
    },
  },
  {
    icon: <List />,
    text: "List",
    format: {
      start: "[list]\n[*]",
      end: "[/list]",
    },
  },
  {
    icon: <ImagePlus />,
    text: "Image",
    format: {
      start: "[img]",
      end: "[/img]",
    },
  },
  {
    icon: <Map />,
    text: "Image Map",
    format: {
      start:
        "[imagemap]\nhttps://example.com/image.jpg\n0 10 10 50 https://example.com example",
      end: "[/imagemap]",
    },
  },
];

export default function BBCodeInput({
  defaultText,
  onSave,
  isSaving,
}: BBCodeInputProps) {
  const [text, setText] = useState<string | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (text)
      return;

    setText(defaultText ?? "");
  }, [defaultText, text]);

  const addToText = (beforeText = "", afterText = "") => {
    if (!textAreaRef.current)
      return;

    const textArea = textAreaRef.current;
    const currentText = textArea.value;
    const selectionStart = textArea.selectionStart || 0;
    const selectionEnd = textArea.selectionEnd || 0;

    let wordStart = selectionStart;
    while (wordStart > 0 && /\w/.test(currentText[wordStart - 1])) {
      wordStart--;
    }

    let wordEnd = selectionEnd;
    while (wordEnd < currentText.length && /\w/.test(currentText[wordEnd])) {
      wordEnd++;
    }

    const word = currentText.slice(wordStart, wordEnd);

    const newText
      = currentText.slice(0, wordStart)
        + beforeText
        + word
        + afterText
        + currentText.slice(wordEnd);

    setText(newText);

    setTimeout(() => {
      const newCursorPosition
        = wordStart + beforeText.length + word.length + afterText.length;
      textArea.selectionStart = newCursorPosition;
      textArea.selectionEnd = newCursorPosition;
      textArea.focus();
    }, 0);
  };

  const formattors = (
    <>
      {formatorsArray.map(({ icon, text, format }) => {
        const { start, end } = format;
        return (
          <HoverCard openDelay={150} closeDelay={150} key={`bbcode-formatter-${text}`}>
            <HoverCardTrigger>
              <Button
                className="size-8 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToText(start, end);
                }}
                variant="secondary"
              >
                {icon}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">{text}</HoverCardContent>
          </HoverCard>
        );
      })}
      <Select
        onValueChange={v => addToText(`[size=${v}]`, "[/size]")}
        value=""
      >
        <SelectTrigger className="w-[110px] bg-secondary shadow-sm hover:bg-secondary/80 data-[placeholder]:text-secondary-foreground">
          <SelectValue placeholder="Font Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="50">Tiny</SelectItem>
          <SelectItem value="85">Small</SelectItem>
          <SelectItem value="100">Normal</SelectItem>
          <SelectItem value="150">Large</SelectItem>
        </SelectContent>
      </Select>
      <Link
        href="https://osu.ppy.sh/wiki/en/BBCode"
        className="text-sm text-secondary-foreground hover:underline"
      >
        Help
      </Link>
    </>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        {text && text.length > 0 && <BBCodeTextField text={text} />}
      </div>

      <textarea
        className="h-32 max-h-96 rounded-lg bg-card p-2 text-sm text-current "
        maxLength={2000}
        value={text ?? ""}
        onChange={e => setText(e.target.value)}
        ref={textAreaRef}
      />

      <div className="mt-2 flex flex-col flex-wrap items-center justify-end gap-2 md:flex-row">
        <Button
          className="mr-auto w-full text-sm md:w-32"
          isLoading={isSaving}
          onClick={() => onSave(text ?? "")}
          variant="secondary"
        >
          <CloudUpload />
          Save
        </Button>
        {isMobile ? (
          <div className="flex flex-wrap items-center gap-2">{formattors}</div>
        ) : (
          formattors
        )}
      </div>
    </div>
  );
}
