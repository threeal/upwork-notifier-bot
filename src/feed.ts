import { Item } from "rss-parser";

/**
 * Formats the given RSS feed item into a string representation.
 *
 * @param item - The RSS feed item to format.
 * @returns A string representation of the RSS feed item.
 */
export function formatRssFeedItem(item: Item): string {
  const lines: string[] = [`**${item.title ?? "Unknown Job"}**`];
  if (item.contentSnippet !== undefined) lines.push(item.contentSnippet);
  if (item.link !== undefined) lines.push(`<${item.link}>`);
  return lines.join("\n\n");
}
