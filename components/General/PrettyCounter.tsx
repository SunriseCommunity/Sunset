"use client";
import { useEffect, useState } from "react";

interface Props {
  value: number;
  duration?: number;
}

export default function PrettyCounter({ value, duration = 1300 }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null as null | number;

    // eslint-disable-next-line no-param-reassign -- intentional
    const easeOut: (t: number) => number = t => --t * t * t + 1;

    const step = (timestamp: number) => {
      if (!startTime)
        startTime = timestamp;
      const progress = timestamp - startTime;

      const percentage = Math.min(progress / duration!, 1);
      const currentNumber = Math.floor(easeOut(percentage) * value);

      setCount(currentNumber);

      if (progress < duration!) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <p>{count}</p>;
}
