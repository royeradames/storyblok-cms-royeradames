import type { ISbRichtext, SbBlokData } from "@storyblok/react";
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

function isRichTextDocument(value: unknown): value is ISbRichtext {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return (value as { type?: unknown }).type === "doc";
}

function isBuilderRichTextBlok(
  blok: SbBlokData,
): blok is SbBlokData & { content: ISbRichtext } {
  const componentName = typeof blok.component === "string" ? blok.component : "";
  if (!componentName.endsWith("rich_text")) return false;
  return isRichTextDocument((blok as { content?: unknown }).content);
}

export interface RichTextHeadingsFromBloksResult {
  headings: RichTextHeading[];
  headingIdsByBlokUid: Record<string, string[]>;
}

export function extractRichTextHeadingsFromBloks(
  bloks: SbBlokData[],
): RichTextHeadingsFromBloksResult {
  const ids = new Map<string, number>();
  const headings: RichTextHeading[] = [];
  const headingIdsByBlokUid: Record<string, string[]> = {};

  for (const blok of bloks) {
    if (!isBuilderRichTextBlok(blok)) continue;

    const blokStartIndex = headings.length;
    collectHeadings(blok.content as unknown as RichTextNode, ids, headings);
    if (typeof blok._uid !== "string" || blok._uid.length === 0) continue;

    headingIdsByBlokUid[blok._uid] = headings
      .slice(blokStartIndex)
      .map((heading) => heading.id);
  }

  return { headings, headingIdsByBlokUid };
}
