import { Item } from "rss-parser";

/**
 * Formats the given RSS feed item into a string representation.
 *
 * @param item - The RSS feed item to format.
 * @returns A string representation of the RSS feed item.
 */
export function formatRssFeedItem(item: Item): string {
  return `**${item.title}**\n\n<${item.link}>\n\n${item.contentSnippet}`;
}
