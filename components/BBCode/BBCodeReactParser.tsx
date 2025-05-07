import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserHoverCard from "@/components/UserHoverCard";
import fetcher from "@/lib/services/fetcher";
import { UserResponse } from "@/lib/types/api";
import { tryParseNumber } from "@/lib/utils/type.util";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export const BBCodeReactParser = React.memo(
  ({ textHtml }: { textHtml: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new MutationObserver(() => {
        parseHtml(container);
      });

      observer.observe(container, { childList: true, subtree: true });

      parseHtml(container);

      return () => observer.disconnect();
    }, []);

    const parseHtml = (container: HTMLDivElement) => {
      parseSpoilerBoxes(container);
      parseBlockquote(container);
      parseLinks(container);
      parseWell(container);
      parseBreaks(container);
      parseImageMapLink(container);
      parseProfileLink(container);
    };

    return (
      <div
        className="font-normal text-sm w-full"
        dangerouslySetInnerHTML={{
          __html: textHtml,
        }}
        ref={containerRef}
      />
    );
  }
);

function parseLinks(container: HTMLDivElement) {
  const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

  container.querySelectorAll("a").forEach((a) => {
    a.className = "text-primary hover:underline";
  });

  function walk(node: Node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).tagName.toLowerCase() === "a"
    ) {
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text || !urlRegex.test(text)) return;

      const frag = document.createDocumentFragment();
      let lastIndex = 0;

      text.replace(urlRegex, (match, _url, offset) => {
        frag.appendChild(
          document.createTextNode(text.slice(lastIndex, offset))
        );

        const a = document.createElement("a");
        a.href = match;
        a.className = "text-primary hover:underline";
        a.textContent = match;
        frag.appendChild(a);

        lastIndex = offset + match.length;
        return match;
      });

      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  }

  walk(container);
}

function parseBreaks(container: HTMLDivElement) {
  const breaks = container.querySelectorAll("break");
  breaks.forEach((b) => {
    const br = document.createElement("br");
    b.replaceWith(br);
  });
}

function parseBlockquote(container: HTMLDivElement) {
  const quotes = container.querySelectorAll("blockquote");
  quotes.forEach((quote) => {
    quote.className =
      "px-4 my-2 border-l-4 border-gray-300 dark:border-gray-500";
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
      <ChevronRight className="text-current inline-block mr-1" size={16} />
    );

    body.style.paddingLeft = "20px";
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

function parseImageMapLink(container: HTMLDivElement) {
  const imageMapLinks = container.querySelectorAll(".imagemap__link");

  imageMapLinks.forEach((link) => {
    if (!link) return;

    link.className = "";

    const wrapper = document.createElement("div");
    link.replaceWith(wrapper);

    function LinkPopover() {
      const triggerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (triggerRef.current) {
          triggerRef.current.innerHTML = "";
          triggerRef.current.setAttribute(
            "style",
            link.getAttribute("style") || ""
          );
        }
      }, []);

      return (
        <Popover>
          <PopoverTrigger className="cursor-pointer" asChild>
            <div ref={triggerRef} />
          </PopoverTrigger>
          <PopoverContent side="top" className="w-fit">
            {link.getAttribute("title")}
          </PopoverContent>
        </Popover>
      );
    }

    createRoot(wrapper).render(<LinkPopover />);
  });
}

function parseProfileLink(container: HTMLDivElement) {
  const profileLinks = container.querySelectorAll(".js-usercard");

  profileLinks.forEach((link) => {
    if (!link) return;

    link.className = "";

    const wrapper = document.createElement("div");
    wrapper.className = "inline-block cursor-pointer";
    link.replaceWith(wrapper);

    function LinkHoverCard() {
      const triggerRef = useRef<HTMLDivElement>(null);

      const [user, setUser] = useState<UserResponse | null>(null);

      const userId = tryParseNumber(link.getAttribute("data-user-id"))
        ? Number(link.getAttribute("data-user-id"))
        : null;

      useEffect(() => {
        fetcher<UserResponse>(`user/${userId}`)
          .then((user) => {
            setUser(user);
          })
          .catch(() => {});

        if (triggerRef.current) {
          triggerRef.current.innerHTML = "";
          triggerRef.current.setAttribute(
            "style",
            link.getAttribute("style") || ""
          );
        }
      }, []);

      if (!user) return null;

      return (
        <UserHoverCard user={user} includeFriendshipButton={false} asChild>
          <Link href={`/user/${userId}`} className="hover:underline">
            {link.innerHTML}
          </Link>
        </UserHoverCard>
      );
    }

    createRoot(wrapper).render(<LinkHoverCard />);
  });
}
