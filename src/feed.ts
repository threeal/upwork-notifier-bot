import { bold, hideLinkEmbed } from "discord";
import { Item } from "rss-parser";

/**
 * Formats the given RSS feed item into a string representation.
 *
 * @param item - The RSS feed item to format.
 * @returns A string representation of the RSS feed item.
 */
export function formatRssFeedItem(item: Item): string {
  const lines: string[] = [bold(item.title ?? "Unknown Job")];

  if (item.contentSnippet !== undefined) {
    const content = item.contentSnippet
      .split("\n")
      .filter((line) => {
        return !line.match(
          /^(Budget:|Hourly Range:|Posted On:|Category:|Skills:|Country:|click to apply)/,
        );
      })
      .join("\n")
      .trim();

    lines.push(content);
  }

  if (item.link !== undefined) {
    lines.push(hideLinkEmbed(item.link));
  }

  return lines.join("\n\n");
}
