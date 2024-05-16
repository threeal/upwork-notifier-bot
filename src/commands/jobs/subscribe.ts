import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord";

import RssParser from "rss-parser";

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
        guids.add(`${item.guid}`);
        await interaction.channel?.send(
          `**${item.title}**\n\n<${item.link}>\n\n${item.contentSnippet}`,
        );
      }
    };

    await callback();
    setInterval(callback, 60000);
  },
};
