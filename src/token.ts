/**
 * Retrieves a Discord bot token from the environment variables.
 *
 * @returns The Discord bot token.
 */
export function getToken(): string {
  return `${process.env["BOT_TOKEN"]}`;
}
