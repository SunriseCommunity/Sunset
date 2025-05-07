import htmlPreset from "@bbob/preset-html5";

export const allowedTags = [
  "b",
  "i",
  "u",
  "s",
  "url",
  "img",
  "quote",
  "code",
  "style",
  "list",
  "color",
  "br",
  "break",
  "hr",
  "email",
  "imagemap",
  "centre",
  "center",
  "notice",
  "heading",
  "box",
  "youtube",
  "size",
  "audio",
  "spoilerbox",
  "c",
  "spoiler",
  "profile",
  "table",
  "tr",
  "td",
];

export const customBBCodePreset = htmlPreset.extend((tags) => ({
  ...tags,
  br: () => ({ tag: "br" }),
  hr: () => ({ tag: "hr" }),
  code: (node) => ({
    tag: "pre",
    attrs: {
      className: "p-2 bg-card rounded",
    },
    content: node.content,
  }),
  c: (node) => ({
    tag: "code",
    attrs: {
      className: "p-1 bg-card rounded",
    },
    content: node.content,
  }),
  spoiler: (node) => ({
    tag: "span",
    attrs: {
      className: "bg-black text-black",
    },
    content: node.content,
  }),
  email: (node) => {
    return {
      tag: "a",
      attrs: {
        href: `mailto:${
          !!node.attrs && Object.keys(node.attrs).length > 0
            ? Object.values(node.attrs).join(" ")
            : ""
        }`,
        rel: "nofollow",
      },
      content: node.content,
    };
  },
  imagemap: (node, { render }) => {
    const lines =
      !!node.content && Object.keys(node.content).length > 0
        ? Object.values(node.content)
            .join(" ")
            .split("[break]")
            .filter((line) => line.trim() !== "")
        : [];

    const imageUrl = lines[0].trim();
    const areas = lines.slice(1);

    const areaElements = areas.map((area) => {
      const parts = area.trim().split(/\s+/);
      const [x, y, width, height, redirect, ...titleParts] = parts;
      const title = titleParts.join(" ");

      return {
        tag: "div",
        attrs: {
          className: "imagemap__link",
          href: redirect,
          style: `position:absolute;display:block;left:${x}%;top:${y}%;width:${width}%;height:${height}%;`,
          ...(title
            ? {
                title: title,
              }
            : {}),
        },
      };
    });

    return {
      tag: "div",
      attrs: {
        className: "imagemap",
        style:
          "max-width:-moz-max-content;max-width:max-content;overflow:hidden;position:relative;",
      },
      content: [
        {
          tag: "Image",
          attrs: {
            className: "imagemap__image",
            style:
              "height:auto;max-width:100%;-o-object-fit:contain;object-fit:contain;width:auto;",
            src: render(imageUrl),
            loading: "lazy",
            alt: imageUrl.split("/").pop(),
          },
        },
        ...areaElements,
      ],
    };
  },
  centre: (node) => ({
    tag: "center",
    content: node.content,
  }),
  list: (node) => {
    const isOrdered = !!node.attrs && Object.keys(node.attrs).length > 0;

    const normalizeContent = (content: any | any[] | undefined): any[] => {
      if (content === undefined || content === null) return [];
      return Array.isArray(content) ? content : [content];
    };

    const splitContentByMarker = (content: any): any[][] => {
      const result: any[][] = [];
      let current: any[] | null = null;

      for (const item of content) {
        if (item === "[*]") {
          if (!current) {
            current = [];
          }

          if (current.length > 0) {
            result.push(current);
            current = [];
          }
        } else if (current != null) {
          current.push(item);
        }
      }

      if (current && current.length > 0) {
        result.push(current);
      }

      return result;
    };

    const contentArray = normalizeContent(node.content);
    const splitItems = splitContentByMarker(contentArray);

    const items = splitItems.map((itemContent) => ({
      tag: "li",
      content: itemContent,
    }));
    return {
      tag: "ol",
      attrs: {
        className: `${isOrdered ? "list-decimal" : "list-disc"} list-inside`,
      },
      content: items,
    };
  },
  notice: (node) => ({
    tag: "div",
    attrs: {
      class: "well",
    },
    content: node.content,
  }),
  quote: (node) => ({
    tag: "blockquote",
    content: [
      {
        tag: "h4",
        attrs: { className: "text-base font-bold" },
        content:
          !!node.attrs && Object.keys(node.attrs).length > 0
            ? Object.keys(node.attrs).join(" ") + " wrote"
            : "",
      },
      {
        tag: "p",
        content: node.content,
      },
    ],
  }),
  heading: (node) => ({
    tag: "h2",
    attrs: { className: "text-2xl font-bold" },
    content: node.content,
  }),
  spoilerbox: (node) => {
    return createSpoilerBox(node, "SPOILER");
  },
  box: (node) => {
    return createSpoilerBox(
      node,
      !!node.attrs && Object.keys(node.attrs).length > 0
        ? Object.keys(node.attrs).join(" ")
        : ""
    );
  },
  profile: (node) => ({
    tag: "div",
    attrs: {
      class: "user-name js-usercard",
      "data-user-id":
        !!node.attrs && Object.keys(node.attrs).length > 0
          ? Object.keys(node.attrs).join(" ")
          : "",
    },
    content: node.content,
  }),
  youtube: (node) => ({
    tag: "iframe",
    attrs: {
      width: "560",
      height: "315",
      src: `https://www.youtube.com/embed/${node.content}`,
      title: "YouTube video player",
      frameborder: "0",
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: true,
    },
  }),
  size: (node) => {
    let sizeValue = parseInt(
      !!node.attrs && Object.keys(node.attrs).length > 0
        ? Object.keys(node.attrs).join(" ")
        : "",
      10
    );

    const minSize = 30;
    const maxSize = 200;

    sizeValue = Math.max(minSize, Math.min(sizeValue, maxSize));

    return {
      tag: "span",
      attrs: {
        style: `font-size:${sizeValue}%;`,
      },
      content: node.content,
    };
  },
  audio: (node) => {
    return {
      tag: "audio",
      attrs: {
        controls: true,
      },
      content: [
        {
          tag: "source",
          attrs: {
            src:
              !!node.content && Object.values(node.content).length > 0
                ? Object.values(node.content).join(" ")
                : "",
            type: "audio/mpeg",
          },
        },
        {
          tag: "span",
          content: "Your browser does not support the audio element.",
        },
      ],
    };
  },
}));

const createSpoilerBox = (node: any, label: string) => {
  return {
    tag: "div",
    attrs: {
      class: "js-spoilerbox bbcode-spoilerbox",
    },
    content: [
      {
        tag: "a",
        attrs: {
          class: "js-spoilerbox__link bbcode-spoilerbox__link",
          href: "#",
        },
        content: [
          {
            tag: "span",
            attrs: {
              class: "bbcode-spoilerbox__link-icon",
            },
          },
          {
            tag: "text",
            content: label,
          },
        ],
      },
      {
        tag: "div",
        attrs: {
          class: "js-spoilerbox__body bbcode-spoilerbox__body",
        },
        content: node.content,
      },
    ],
  };
};
