import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord";

import { formatRssFeedItem, tryToFetchRssFeedFromUrl } from "../../feed.js";
import { tryToSendMessageToChannel } from "../../message.js";
import store from "../../store/db.js";

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

    const callback = async () => {
      const feed = await tryToFetchRssFeedFromUrl(`${url}`);
      for (const item of feed) {
        if (store.data.includes(`${item.guid}`)) continue;
        const sent = await tryToSendMessageToChannel(
          formatRssFeedItem(item),
          interaction.channel,
        );
        if (sent) store.update((data) => data.push(`${item.guid}`));
      }
    };

    await callback();
    setInterval(callback, 60000);
  },
};
