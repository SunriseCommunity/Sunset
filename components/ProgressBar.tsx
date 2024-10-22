import { twMerge } from "tailwind-merge";

interface ProgressBarProps {
  value: number;
  maxValue: number;
  className?: string;
}

export default function ProgressBar({
  value,
  maxValue,
  className,
}: ProgressBarProps) {
  return (
    <div className={twMerge(`w-full`, className)}>
      <div className="h-1.5 bg-stone-600 rounded-sm">
        <div
          className="h-full bg-terracotta-400 rounded-sm smooth-transition"
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
    </div>
  );
}
