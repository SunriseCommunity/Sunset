"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollUpButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (showButton) {
    return (
      <div
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 text-2xl bg-terracotta-500 text-white p-2 rounded-full shadow-lg cursor-pointer"
      >
        <ArrowUp />
      </div>
    );
  }
}
