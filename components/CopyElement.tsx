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
    <div className="relative group inline-flex items-center space-x-1">
      <button
        onClick={handleCopy}
        className="flex"
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      >
        {children}
        <div className="ml-1">
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </div>
      </button>
    </div>
  );
}
