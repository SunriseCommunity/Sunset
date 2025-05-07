"use client";

import {
  BoldIcon,
  Box,
  Heading,
  Heading6,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Map,
  Strikethrough,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import BBCodeTextField from "@/components/BBCode/BBCodeTextField";
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
import Link from "next/link";

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

  useEffect(() => {
    if (text) return;

    setText(defaultText ?? "");
  }, [defaultText]);

  const addToText = (beforeText = "", afterText = "") => {
    if (!textAreaRef.current) return;

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

    const newText =
      currentText.slice(0, wordStart) +
      beforeText +
      word +
      afterText +
      currentText.slice(wordEnd);

    setText(newText);

    setTimeout(() => {
      const newCursorPosition =
        wordStart + beforeText.length + word.length + afterText.length;
      textArea.selectionStart = newCursorPosition;
      textArea.selectionEnd = newCursorPosition;
      textArea.focus();
    }, 0);
  };

  return (
    <div className="flex flex-col gap-2">
      {text && text.length > 0 && <BBCodeTextField text={text} />}

      <textarea
        className="bg-card p-2 rounded-lg h-32 text-sm text-current"
        maxLength={2000}
        value={text ?? ""}
        onChange={(e) => setText(e.target.value)}
        ref={textAreaRef}
      ></textarea>

      <div className="flex justify-between md:flex-row flex-col gap-2 items-center mt-2">
        <Button
          className="md:w-32 w-full text-sm"
          isLoading={isSaving}
          onClick={() => onSave(text ?? "")}
          variant="secondary"
        >
          <CloudUpload />
          Save
        </Button>
        <div className="flex gap-2 flex-wrap items-center">
          {formatorsArray.map(({ icon, text, format }, i) => {
            const { start, end } = format;
            return (
              <HoverCard openDelay={150} closeDelay={150} key={i}>
                <HoverCardTrigger>
                  <Button
                    className="w-8 h-8 rounded-lg"
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
            onValueChange={(v) => addToText(`[size=${v}]`, "[/size]")}
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
        </div>
      </div>

      <label className="text-xs mt-2">
        * Reminder: Do not post any inappropriate content. Try to keep it family
        friendly :)
      </label>
    </div>
  );
}
