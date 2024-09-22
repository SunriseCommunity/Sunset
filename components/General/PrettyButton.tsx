import Spinner from "@/components/Spinner";
import { twMerge } from "tailwind-merge";

interface PrettyButtonProps {
  onClick: () => void;
  text?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  isAction?: boolean;
}

export default function PrettyButton({
  isLoading,
  onClick,
  text,
  icon,
  className,
  isAction,
}: PrettyButtonProps) {
  if (!text && !icon) throw new Error("You must provide either text or icon.");

  return (
    <button
      className={twMerge(
        "bg-terracotta-800 hover:bg-terracotta-400 hover:text-white smooth-transition p-2 rounded",
        isAction ? "text-white" : "text-yellow-pastel",
        className
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex items-center">
          <div className={text && icon ? "mr-2" : ""}>{icon}</div>
          {text}
        </div>
      )}
    </button>
  );
}
