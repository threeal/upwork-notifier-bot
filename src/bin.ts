#!/usr/bin/env node

import { Client, Events, GatewayIntentBits } from "discord";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .scriptName("upwork-notifier-bot")
  .version("0.0.0")
  .command("start", "Start the Upwork notifier bot", async () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once(Events.ClientReady, () => {
      console.log("Client ready!");
    });

    client.login(process.env["BOT_TOKEN"]);
  })
  .demandCommand(1)
  .parse();
