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
  onOpenChange?: () => void;
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
  onOpenChange,
  asChild,
}: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger
        className={twMerge("cursor-pointer", className)}
        asChild={asChild}
      >
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
