import { getErrorMessage } from "catched-error-message";
import { TextBasedChannel } from "discord";
import logger from "./logger.js";

/**
 * Attempts to send a message to a channel.
 *
 * @param message - The message to send.
 * @param channel - The channel to send the message to.
 * @returns A promise that resolves to a boolean indicating whether the message was sent.
 */
export async function tryToSendMessageToChannel(
  message: string,
  channel: TextBasedChannel,
): Promise<boolean> {
  try {
    await channel.send(message);
    return true;
  } catch (err) {
    logger.warn(
      `Failed to send a message to the channel: ${getErrorMessage(err)}`,
    );
    return false;
  }
}
