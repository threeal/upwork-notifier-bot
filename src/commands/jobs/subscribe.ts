import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord";

import RssParser from "rss-parser";
import { formatRssFeedItem } from "../../feed.js";
import { tryToSendMessageToChannel } from "../../message.js";

const rssParser = new RssParser();

export default {
  data: new SlashCommandBuilder()
    .setName("subscribe-jobs")
    .setDescription("subscribe to jobs from the given RSS feed URL")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The RSS feed URL")
        .setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const url = interaction.options.getString("url");
    await interaction.reply(`Subscribed to: <${url}>`);

    const guids = new Set<string>();
    const callback = async () => {
      const feed = await rssParser.parseURL(`${url}`);
      for (const item of feed.items) {
        if (guids.has(`${item.guid}`)) continue;
        const sent = await tryToSendMessageToChannel(
          formatRssFeedItem(item),
          interaction.channel,
        );
        if (sent) guids.add(`${item.guid}`);
      }
    };

    await callback();
    setInterval(callback, 60000);
  },
};
