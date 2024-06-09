import { getErrorMessage } from "catched-error-message";
import { bold, hideLinkEmbed } from "discord";
import RssParser, { Item } from "rss-parser";
import logger from "./logger.js";

const rssParser = new RssParser();

/**
 * Attempts to fetch RSS feed items from the given URL.
 *
 * @param url - The URL to fetch the RSS feed from.
 * @returns A promise that resolves to a list of RSS feed items.
 */
export async function tryToFetchRssFeedFromUrl(url: string): Promise<Item[]> {
  try {
    const res = await rssParser.parseURL(url);
    return res.items;
  } catch (err) {
    logger.warn(
      `Failed to fetch RSS feed from '${url}': ${getErrorMessage(err)}`,
    );
    return [];
  }
}

/**
 * Formats the given RSS feed item into a string representation.
 *
 * @param item - The RSS feed item to format.
 * @returns A string representation of the RSS feed item.
 */
export function formatRssFeedItem(item: Item): string {
  const lines: string[] = [`:mag_right: ${bold(item.title ?? "Unknown Job")}`];

  if (item.contentSnippet !== undefined) {
    const infos: string[] = [];

    const content = item.contentSnippet
      .split("\n")
      .filter((line) => {
        if (line.match(/^(Budget:|Hourly Range:|Posted On:)/)) {
          if (line.match(/^(Budget:|Hourly Range:)/)) {
            infos.push(`:money_with_wings: ${line}`);
          } else {
            infos.push(`:calendar_spiral: ${line}`);
          }
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
    lines.push(`:link: ${hideLinkEmbed(item.link)}`);
  }

  lines.push(Array(18).fill(":four_leaf_clover:").join(""));

  return lines.join("\n\n");
}
