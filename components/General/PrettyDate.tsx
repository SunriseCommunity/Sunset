"use client";
import { Tooltip } from "@/components/Tooltip";
import Cookies from "js-cookie";

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

  const locale = Cookies.get("locale") || "en";

  return withTime ? (
    <Tooltip content={date.toLocaleTimeString()}>
      <div className={className}>
        {date.toLocaleDateString(locale, options)}
      </div>
    </Tooltip>
  ) : (
    <div className={className}>{date.toLocaleDateString(locale, options)}</div>
  );
}

export function dateToPrettyString(time: string | Date) {
  const date = time instanceof Date ? time : new Date(time);

  return date.toLocaleDateString(Cookies.get("locale") || "en", options);
}
