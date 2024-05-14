import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord";

export default {
  data: new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("Schedule a message to be sent later")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to be sent later")
        .setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const message = interaction.options.getString("message");
    setTimeout(() => interaction.channel?.send(`${message}`), 10000);
    interaction.reply(`Scheduled "${message}" in 10 seconds`);
  },
};
