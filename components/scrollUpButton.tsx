"use client";
import { Button } from "@/components/ui/button";
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
      <Button
        size="icon"
        variant="secondary"
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 shadow-lg"
      >
        <ArrowUp />
      </Button>
    );
  }
}
