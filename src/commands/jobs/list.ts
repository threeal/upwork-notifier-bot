import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord";

import RssParser from "rss-parser";
import { formatRssFeedItem } from "../../feed.js";

const rssParser = new RssParser();

export default {
  data: new SlashCommandBuilder()
    .setName("list-jobs")
    .setDescription("List jobs from the given RSS feed URL")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The RSS feed URL")
        .setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const url = interaction.options.getString("url");
    const feed = await rssParser.parseURL(`${url}`);
    await interaction.reply(`Listing ${feed.items.length} jobs:`);
    for (const item of feed.items) {
      await interaction.channel?.send(formatRssFeedItem(item));
    }
  },
};
