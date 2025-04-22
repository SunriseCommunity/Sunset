import { ChevronRight } from "lucide-react";
import React from "react";
import { useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export const BeatmapDescription = React.memo(
  ({ descriptionHtml }: { descriptionHtml: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new MutationObserver(() => {
        parseDescription(container);
      });

      observer.observe(container, { childList: true, subtree: true });

      parseDescription(container);

      return () => observer.disconnect();
    }, []);

    const parseDescription = (container: HTMLDivElement) => {
      parseSpoilerBoxes(container);
      parseBlockquote(container);
      parseLinks(container);
      parseWell(container);
    };

    return (
      <div
        className="font-normal text-sm w-full"
        dangerouslySetInnerHTML={{
          __html: descriptionHtml,
        }}
        ref={containerRef}
      />
    );
  }
);

function parseLinks(container: HTMLDivElement) {
  const links = container.querySelectorAll("a");
  links.forEach((a) => {
    a.className = "text-primary hover:underline";
  });
}

function parseBlockquote(container: HTMLDivElement) {
  const quotes = container.querySelectorAll("blockquote");
  quotes.forEach((quote) => {
    quote.className =
      "p-4 my-2 border-l-4 border-gray-300 dark:border-gray-500";
  });
}

function parseWell(container: HTMLDivElement) {
  const quotes = container.querySelectorAll(".well");
  quotes.forEach((quote) => {
    quote.className =
      "p-4 bg-card border-2 rounded border-gray-300 dark:border-gray-500";
  });
}

function parseSpoilerBoxes(container: HTMLDivElement) {
  const spoilerboxes = container.querySelectorAll(".js-spoilerbox");

  spoilerboxes.forEach((box) => {
    const body = box.querySelector(
      ".js-spoilerbox__body"
    ) as HTMLElement | null;
    const link = box.querySelector(
      ".js-spoilerbox__link"
    ) as HTMLElement | null;
    const icon = link?.querySelector(
      ".bbcode-spoilerbox__link-icon"
    ) as HTMLElement | null;

    if (!body || !link || !icon) return;

    const mountPoint = document.createElement("span");
    mountPoint.className = "inline-block transition-transform";
    icon.insertBefore(mountPoint, icon.firstChild);

    createRoot(mountPoint).render(
      <ChevronRight className="text-white inline-block mr-1" size={16} />
    );

    body.style.padding = "20px";
    body.style.display = "none";
    mountPoint.style.transform = "rotate(0deg)";

    const handleClick = (e: Event) => {
      e.preventDefault();
      const isOpen = body.style.display === "block";
      body.style.display = isOpen ? "none" : "block";
      mountPoint.style.transform =
        body.style.display === "block" ? "rotate(90deg)" : "rotate(0deg)";
    };

    link.addEventListener("click", handleClick);

    return () => {
      link.removeEventListener("click", handleClick);
    };
  });
}
