import { TextBasedChannel } from "discord";
import { formatRssFeedItem, tryToFetchRssFeedFromUrl } from "../feed.js";
import { tryToSendMessageToChannel } from "../message.js";
import { isJobPosted, markJobAsPosted } from "../store/jobs.js";

/**
 * Handles a job subscription.
 *
 * This function handles a job subscription by fetching new job information from
 * the given RSS feed URL and sending the information via messages to the
 * specified channel.
 *
 * @param url - The RSS feed URL.
 * @param channel - The destination channel.
 * @returns A promise that resolves to nothing.
 */
export async function handleJobSubscription(
  url: string,
  channel: TextBasedChannel,
): Promise<void> {
  const feed = await tryToFetchRssFeedFromUrl(url);
  for (const item of feed) {
    if (isJobPosted(item.guid)) continue;
    const sent = await tryToSendMessageToChannel(
      formatRssFeedItem(item),
      channel,
    );
    if (sent) await markJobAsPosted(item.guid);
  }
}
