import { twMerge } from "tailwind-merge";

interface PrettyHeaderProps {
  icon?: React.ReactNode;
  text: string;
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
        `bg-coffee-600 rounded-t-lg p-4 flex items-center`,
        className,
        children ? "place-content-between" : "",
        roundBottom ? "rounded-b-lg" : ""
      )}
    >
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <h2 className="text-lg font-semibold">{text}</h2>
        {counter && (
          <div className="ml-2 text-xs text-gray-300 bg-coffee-700 rounded-full px-2 py-1">
            {counter}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
