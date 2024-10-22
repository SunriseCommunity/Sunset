import Spinner from "@/components/Spinner";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface PrettyButtonProps {
  onClick: () => void;
  text?: string;
  bottomText?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  isAction?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function PrettyButton({
  isLoading,
  onClick,
  text,
  bottomText,
  icon,
  className,
  isAction,
  disabled,
  children,
}: PrettyButtonProps) {
  if (!text && !icon) throw new Error("You must provide either text or icon.");

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <button
      className={twMerge(
        "bg-terracotta-800 smooth-transition p-2 rounded",
        isAction ? "text-white" : "text-yellow-pastel",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-terracotta-400 hover:text-white",
        className
      )}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      <div
        style={{
          width: isLoading ? `${contentRef.current?.offsetWidth}px` : "auto",
          height: isLoading ? `${contentRef.current?.offsetHeight}px` : "auto",
        }}
        className="flex items-center justify-center"
      >
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <div className="flex items-center" ref={contentRef}>
            <div className={text && icon ? "mr-2" : ""}>{icon}</div>
            <div className="flex flex-col text-left">
              {text && (
                <p
                  className={twMerge(
                    text && icon ? "mr-2" : "",
                    bottomText ? "text-xs" : ""
                  )}
                >
                  {text}
                </p>
              )}
              {bottomText && (
                <p className="text-[10px] leading-[12px] font-extralight">
                  {bottomText}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {children}
    </button>
  );
}
