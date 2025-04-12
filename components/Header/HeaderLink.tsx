"use client";
import tailwindConfig from "@/tailwind.config";
import { usePathname } from "next/navigation";
import resolveConfig from "tailwindcss/resolveConfig";

interface Props {
  name: string;
  isHovered: boolean;
}

export default function HeaderLink({ name, isHovered }: Props) {
  const pathname = usePathname();
  const linkPath = `/${name.replace(" ", "").toLowerCase()}`;
  const isActive = pathname === linkPath;

  // const { theme } = resolveConfig(tailwindConfig);

  return (
    <a
      href={linkPath}
      aria-label={name}
      className={`relative px-2 py-1 text-current/30 smooth-transition cursor-pointer hover:text-current ${
        !isHovered ? "opacity-40" : ""
      }`}
    >
      <p
        className={`text-base ${
          isActive ? "text-current font-bold" : ""
        } hover:bg-neutral-600 hover:bg-opacity-25 p-1 rounded-md smooth-transition`}
      >
        {name}

        {/* Active indicator */}
        <span
          className={`absolute mt-0.5 h-[3px] w-[calc(100%-16px)] smooth-transition ${
            isActive ? (isHovered ? `bg-primary` : "bg-current") : ""
          } inline-block rounded-3xl top-full right-2 ${
            isActive ? "opacity-100" : "opacity-40"
          }`}
        />
      </p>
    </a>
  );
}
