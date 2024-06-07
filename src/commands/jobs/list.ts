import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord";

import { formatRssFeedItem, tryToFetchRssFeedFromUrl } from "../../feed.js";
import { tryToSendMessageToChannel } from "../../message.js";

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
    const feed = await tryToFetchRssFeedFromUrl(`${url}`);
    await interaction.reply(`Listing ${feed.length} jobs:`);
    for (const item of feed) {
      await tryToSendMessageToChannel(
        formatRssFeedItem(item),
        interaction.channel,
      );
    }
  },
};
