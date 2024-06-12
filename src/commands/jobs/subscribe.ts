import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord";

import { handleJobSubscription } from "../../schedules/jobs.js";

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
      await handleJobSubscription(`${url}`, interaction.channel);
    };

    await callback();
    setInterval(callback, 60000);
  },
};
