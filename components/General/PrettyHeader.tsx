import { twMerge } from "tailwind-merge";

interface PrettyHeaderProps {
  icon?: React.ReactNode;
  text: string;
  roundBottom?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function PrettyHeader({
  children,
  icon,
  text,
  className,
  roundBottom = false,
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
      </div>
      {children}
    </div>
  );
}
