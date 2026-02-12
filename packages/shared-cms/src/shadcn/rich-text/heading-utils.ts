import type { ISbRichtext } from "@storyblok/react";
import type { RichTextHeading, RichTextNode } from "./types";

function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getNodeText(node: RichTextNode): string {
  if (node.type === "text") return node.text || "";
  return (node.content || []).map(getNodeText).join("");
}

function collectHeadings(
  node: RichTextNode,
  ids: Map<string, number>,
  out: RichTextHeading[],
): void {
  if (node.type === "heading") {
    const level = Math.min(Math.max(Number(node.attrs?.level || 2), 1), 6);
    const text = getNodeText(node).trim();
    if (text.length > 0) {
      const base = slugifyHeading(text) || "section";
      const count = ids.get(base) ?? 0;
      ids.set(base, count + 1);
      out.push({
        id: count === 0 ? base : `${base}-${count + 1}`,
        text,
        level,
      });
    }
  }

  for (const child of node.content || []) {
    collectHeadings(child, ids, out);
  }
}

export function extractRichTextHeadings(content: ISbRichtext): RichTextHeading[] {
  const root = content as unknown as RichTextNode;
  const ids = new Map<string, number>();
  const headings: RichTextHeading[] = [];
  collectHeadings(root, ids, headings);
  return headings;
}
