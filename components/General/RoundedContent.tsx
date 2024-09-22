import { twMerge } from "tailwind-merge";

interface RoundedContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function RoundedContent({
  children,
  className,
}: RoundedContentProps) {
  return (
    <div>
      <div
        className={twMerge(
          "bg-coffee-700 p-4 rounded-b-lg min-h-60 max-h-60 h-60",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
