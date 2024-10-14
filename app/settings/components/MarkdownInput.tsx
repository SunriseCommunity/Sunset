"use client";
import { BoldIcon, ImagePlus, Italic, Strikethrough } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { remark } from "remark";
import html from "remark-html";
import PrettyButton from "@/components/General/PrettyButton";
import remarkGfm from "remark-gfm";

interface MarkdownInputProps {
  onSave: (text: string) => void;
  isSaving?: boolean;
  defaultText?: string;
}

export default function MarkdownInput({
  defaultText,
  onSave,
  isSaving,
}: MarkdownInputProps) {
  const [text, setText] = useState("");
  const [markdown, setMarkdown] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(defaultText || "");
  }, [defaultText]);

  const addToText = (text: string) => {
    const selectionStart = textAreaRef.current?.selectionStart;
    setText((prev) => {
      return (
        prev.slice(0, selectionStart) +
        text +
        prev.slice(selectionStart, prev.length)
      );
    });

    textAreaRef.current?.focus();
  };

  useEffect(() => {
    const processMarkdown = async () => {
      const processedContent = await remark()
        .use(html)
        .use(remarkGfm)
        .process(text);
      setMarkdown(processedContent.toString());
    };

    processMarkdown();
  }, [text]);

  return (
    <div className="flex flex-col">
      {markdown.length > 0 && (
        <div
          className="mb-6 max-h-80 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: markdown }}
        />
      )}

      <textarea
        className="bg-terracotta-500 p-2 rounded-lg h-32 text-sm text-white"
        maxLength={2000}
        value={text}
        onChange={(e) => setText(e.target.value)}
        ref={textAreaRef}
        defaultValue={defaultText}
      ></textarea>

      <div className="flex justify-between items-center mt-2">
        <PrettyButton
          text="Save"
          className="w-32 text-sm"
          icon={<CloudUpload />}
          isLoading={isSaving}
          onClick={() => onSave(text)}
        />
        <div className="flex">
          <PrettyButton
            className="w-8 h-8 rounded-lg mr-2"
            icon={<BoldIcon className="w-4 h-4" />}
            onClick={() => addToText("****")}
          />
          <PrettyButton
            className="w-8 h-8 rounded-lg"
            icon={<Italic className="w-4 h-4" />}
            onClick={() => addToText("**")}
          />
          <PrettyButton
            className="w-8 h-8 rounded-lg ml-2"
            icon={<Strikethrough className="w-4 h-4" />}
            onClick={() => addToText("~~~~")}
          />
          <PrettyButton
            className="w-8 h-8 rounded-lg ml-2"
            icon={<ImagePlus className="w-4 h-4" />}
            onClick={() => addToText("![text](url)")}
          />
        </div>
      </div>

      <label className="text-xs mt-2">
        * Reminder: Do not post any inappropriate content. Try to keep it family
        friendly :)
      </label>
    </div>
  );
}
