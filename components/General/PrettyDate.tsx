import { Tooltip } from "@/components/Tooltip";

interface PrettyDateProps {
  time: string | Date;
  className?: string;
}

export default function PrettyDate({ time, className }: PrettyDateProps) {
  const date = time instanceof Date ? time : new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return (
    <Tooltip content={date.toLocaleTimeString()}>
      <div className={className}>
        {date.toLocaleDateString("en-US", options)}
      </div>
    </Tooltip>
  );
}
