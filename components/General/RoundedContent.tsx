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
    <div
      className={twMerge(
        "bg-accent p-4 rounded-b-lg h-fit min-h-fit max-h-fit border shadow",
        className,
      )}
    >
      {children}
    </div>
  );
}
