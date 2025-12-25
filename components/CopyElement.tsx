import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyElement({
  children,
  copyContent,
}: {
  copyContent: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  let timeout: NodeJS.Timeout;

  const handleCopy = async () => {
    clearTimeout(timeout);
    await navigator.clipboard.writeText(copyContent);
    setCopied(true);
    timeout = setTimeout(() => setCopied(false), 900);
  };

  return (
    <div className="group relative inline-flex items-center space-x-1">
      <button
        onClick={handleCopy}
        className="flex"
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      >
        {children}
        <div className="ml-1">
          {copied ? (
            <Check className="size-3 text-green-500" />
          ) : (
            <Copy className="size-3 text-muted-foreground opacity-0 transition-opacity duration-200 hover:text-foreground group-hover:opacity-100" />
          )}
        </div>
      </button>
    </div>
  );
}
