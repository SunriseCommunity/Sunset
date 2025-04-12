import { twMerge } from "tailwind-merge";

interface PrettyHeaderProps {
  icon?: React.ReactNode;
  text?: string;
  roundBottom?: boolean;
  children?: React.ReactNode;
  className?: string;
  counter?: number;
}

export default function PrettyHeader({
  children,
  icon,
  text,
  className,
  roundBottom = false,
  counter,
}: PrettyHeaderProps) {
  return (
    <div
      className={twMerge(
        `bg-card rounded-t-lg p-4 flex items-center border shadow`,
        className,
        children ? "place-content-between" : "",
        roundBottom ? "rounded-b-lg" : ""
      )}
    >
      <div className="flex items-center">
        {icon && <div className="mr-2 text-current/30">{icon}</div>}
        <h2 className="text-lg font-semibold capitalize">{text}</h2>
        {counter && (
          <div className="ml-2 text-xs text-current/30 bg-background rounded-full px-2 py-1">
            {counter}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
