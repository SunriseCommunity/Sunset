import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  disabled?: boolean;
  className?: string;
  asChild?: boolean;
}

export function Tooltip({
  content,
  children,
  align = "center",
  alignOffset,
  side = "top",
  sideOffset,
  disabled,
  className,
}: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <Popover>
      <PopoverTrigger className={twMerge("cursor-pointer", className)}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="p-2 text-sm max-w-80 w-fit break-normal whitespace-normal flex"
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
