"use client";
import { usePathname } from "next/navigation";

interface Props {
  name: string;
  isHovered: boolean;
}

export default function HeaderLink({ name, isHovered }: Props) {
  const pathname = usePathname();
  const linkPath = `/${name.replace(" ", "").toLowerCase()}`;
  const isActive = pathname === linkPath;

  const color = "orange";

  return (
    <a
      href={linkPath}
      aria-label={name}
      className={`relative px-2 py-1 text-gray-300 smooth-transition cursor-pointer hover:text-white ${
        !isHovered ? "opacity-40" : ""
      }`}
    >
      <p
        className={`text-base ${
          isActive ? "text-white font-bold" : ""
        } hover:bg-neutral-600 hover:bg-opacity-25 p-1 rounded-md smooth-transition`}
      >
        {name}

        {/* Active indicator */}
        <span
          style={{
            boxShadow: `${isHovered && isActive ? `0 0 8px ${color}` : `none`}`,
          }}
          className={`absolute mt-0.5 h-[3px] w-[calc(100%-16px)] smooth-transition ${
            isActive ? (isHovered ? `bg-${color}-600` : "bg-white") : ""
          } inline-block rounded-3xl top-full right-2 ${
            isActive ? "opacity-100" : "opacity-40"
          }`}
        />
      </p>
    </a>
  );
}
