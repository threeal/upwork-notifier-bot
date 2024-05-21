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
    const infos: string[] = [];

    const content = item.contentSnippet
      .split("\n")
      .filter((line) => {
        if (line.match(/^(Budget:|Hourly Range:|Posted On:)/)) {
          infos.push(line);
          return false;
        }
        return !line.match(/^(Category:|Skills:|Country:|click to apply)/);
      })
      .join("\n")
      .trim();

    if (infos.length > 0) {
      lines.push(infos.join("\n"));
    }

    lines.push(content);
  }

  if (item.link !== undefined) {
    lines.push(hideLinkEmbed(item.link));
  }

  return lines.join("\n\n");
}
