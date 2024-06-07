#!/usr/bin/env node

import { getErrorMessage } from "catched-error-message";
import { Client, Events, GatewayIntentBits, Routes } from "discord";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import ListJobsCommand from "./commands/jobs/list.js";
import SubscribeJobsCommand from "./commands/jobs/subscribe.js";
import { getToken } from "./token.js";

yargs(hideBin(process.argv))
  .scriptName("upwork-notifier-bot")
  .version("0.0.0")
  .command("start", "Start the Upwork notifier bot", async () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    const commands = [ListJobsCommand, SubscribeJobsCommand];

    client.once(Events.ClientReady, async (client) => {
      console.info(`Logged in as ${client.user.tag}!`);

      await client.rest.put(Routes.applicationCommands(client.application.id), {
        body: commands.map((command) => command.data.toJSON()),
      });
      console.log("Commands registered!");
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      console.log(`Received command: ${interaction.commandName}`);

      const command = commands.find(
        (command) => command.data.name === interaction.commandName,
      );
      if (command !== undefined) {
        await command.execute(interaction);
      } else {
        console.warn(
          `Could not find handler for command: ${interaction.commandName}`,
        );
      }
    });

    try {
      await client.login(await getToken());
    } catch (err) {
      console.error(`Failed to log in: ${getErrorMessage(err)}`);
    }
  })
  .demandCommand(1)
  .parse();
