import readline from "node:readline/promises";

/**
 * Retrieves a Discord bot token from the environment variables or from user input.
 *
 * @returns A promise resolving to the Discord bot token.
 */
export async function getToken(): Promise<string> {
  const token = process.env["BOT_TOKEN"];
  if (token !== undefined) return token;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return await rl.question("Input Discord bot token: ");
}
