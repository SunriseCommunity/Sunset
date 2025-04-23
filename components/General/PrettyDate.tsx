import { Tooltip } from "@/components/Tooltip";

interface PrettyDateProps {
  time: string | Date;
  className?: string;
  withTime?: boolean;
}

const options: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

export default function PrettyDate({
  time,
  className,
  withTime = true,
}: PrettyDateProps) {
  const date = time instanceof Date ? time : new Date(time);

  return withTime ? (
    <Tooltip content={date.toLocaleTimeString()}>
      <div className={className}>
        {date.toLocaleDateString("en-US", options)}
      </div>
    </Tooltip>
  ) : (
    <div className={className}>{date.toLocaleDateString("en-US", options)}</div>
  );
}

export function dateToPrettyString(time: string | Date) {
  const date = time instanceof Date ? time : new Date(time);

  return date.toLocaleDateString("en-US", options);
}
