import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  rank: number;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

export default function UserRankColor({
  rank,
  variant,
  children,
  ...props
}: Props) {
  let colourPalette;

  switch (variant) {
    case "primary":
      colourPalette = {
        1: "from-purple-600 via-pink-500 to-red-400",
        2: "from-blue-400 via-cyan-400 to-teal-400",
        3: "from-amber-700 via-amber-600 to-amber-500",
      };
      break;
    case "secondary": {
      colourPalette = {
        1: "from-stone-400 via-stone-200 to-amber-200",
        2: "from-gray-300 via-gray-100 to-blue-200",
        3: "from-stone-500 via-stone-400 to-rose-200",
      };
      break;
    }
  }

  if (!colourPalette) {
    throw new Error("Couldn't find colour palette");
  }

  return (
    <div
      {...props}
      className={twMerge(
        colourPalette[rank]
          ? twMerge(
              colourPalette[rank],
              "bg-gradient-to-r text-transparent bg-clip-text bg-size-300 animate-gradient",
            )
          : "",
        props.className,
      )}
    >
      {children}
    </div>
  );
}
