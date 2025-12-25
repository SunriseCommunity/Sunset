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
        children ? "place-content-between" : "",
        roundBottom ? "rounded-b-lg" : "",
        className,
      )}
    >
      <div
        className={twMerge(
          "flex items-center",
          !icon && !text && !counter ? "hidden" : "",
        )}
      >
        {icon && <div className="text-current/30 mr-2">{icon}</div>}
        <h2 className="text-lg font-semibold capitalize">{text}</h2>
        {counter && (
          <div className="text-current/30 ml-2 rounded-full bg-background px-2 py-1 text-xs">
            {counter}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
