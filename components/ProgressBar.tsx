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
      <div className="h-1.5 rounded-sm bg-card">
        <div
          className="smooth-transition h-full rounded-sm bg-primary"
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
    </div>
  );
}
