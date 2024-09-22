import { Tooltip } from "@/components/Tooltip";

interface PrettyDateProps {
  time: string | Date;
}

export default function PrettyDate({ time }: PrettyDateProps) {
  const date = time instanceof Date ? time : new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return (
    <Tooltip content={date.toLocaleTimeString()}>
      {date.toLocaleDateString("en-US", options)}
    </Tooltip>
  );
}
