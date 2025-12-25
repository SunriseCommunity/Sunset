"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function ScrollUpButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      }
      else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => window.removeEventListener("scroll", scrollListener);
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
