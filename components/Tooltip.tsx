import { twMerge } from "tailwind-merge";

interface TooltipProps {
  position?: "top" | "bottom" | "left" | "right";
  content: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Tooltip({
  position = "top",
  content,
  children,
  disabled,
}: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <div className={`relative cursor-pointer group`}>
      <div>{children}</div>
      <span
        className={twMerge(
          "absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:scale-100 scale-75 bg-card text-current text-xs p-2 whitespace-nowrap rounded transition-all ease-out duration-200 z-50 shadow-card/30 shadow-lg ",
          position === "top"
            ? "left-1/2 -translate-x-1/2 bottom-[calc(100%+5px)] group-hover:translate-y-0 translate-y-1/2"
            : "",
          position === "bottom"
            ? "left-1/2 -translate-x-1/2 top-[calc(100%+5px)] group-hover:translate-y-0 -translate-y-1/2"
            : "",
          position === "left"
            ? "top-1/2 -translate-y-1/2 right-[calc(100%+5px)] group-hover:translate-x-0 translate-x-1/4"
            : "",
          position === "right"
            ? "top-1/2 -translate-y-1/2 left-[calc(100%+5px)] group-hover:translate-x-0 -translate-x-1/4"
            : ""
        )}
      >
        {content}
      </span>
    </div>
  );
}
