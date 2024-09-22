import { twMerge } from "tailwind-merge";

interface SkeletonLoadingProps {
  className?: string;
}

export default function SkeletonLoading({ className }: SkeletonLoadingProps) {
  return (
    <div
      className={twMerge("animate-pulse bg-gray-200 rounded-sm", className)}
    />
  );
}
