import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export default function BeatmapDescription({
  descriptionHtml,
}: {
  descriptionHtml: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    parseSpoilerBoxes(container);
    parseLinks(container);
  }, [descriptionHtml]);

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

function parseLinks(container: HTMLDivElement) {
  const links = container.querySelectorAll("a");
  links.forEach((a) => {
    a.className = "text-primary hover:underline";
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
