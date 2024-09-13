"use client";
import { useEffect, useRef, useState } from "react";
import HeaderLink from "@/components/Header/HeaderLink";
import HeaderAccount from "@/components/Header/HeaderAccount";

export default function Header() {
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
      setIsHovered(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => !scrolled && setIsHovered(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-xl">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`left-0 relative right-0 top-0 z-50 flex items-center border-b-2 border-opacity-60 border-white justify-between row-padding py-2 smooth-transition backdrop-blur-xl hover:bg-stone-800 hover:bg-opacity-80 ${
          scrolled ? "bg-stone-800 bg-opacity-80" : "bg-transparent"
        }`}
      >
        <div className="flex items-center space-x-6">
          {/* Brand */}
          <a href="/" className="smooth-transition">
            <h1 className="text-4xl font-semibold text-white smooth-transition pb-1 cursor-pointer">
              sunrise
            </h1>
          </a>

          {/* Links */}
          <span className="flex items-center space-x-6 text-sm font-medium">
            <HeaderLink name="leaderboard" color="orange" isHovered={hovered} />
            <HeaderLink name="beatmaps" color="blue" isHovered={hovered} />
            <HeaderLink name="wiki" color="green" isHovered={hovered} />
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <HeaderAccount
            dropdownMenuRef={dropdownMenuRef}
            isHovered={hovered}
          />
        </div>
      </div>
      <div
        ref={dropdownMenuRef}
        className=" flex justify-end w-full overflow-hidden row-padding"
      />
    </header>
  );
}
