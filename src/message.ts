import { getErrorMessage } from "catched-error-message";
import { Message, TextBasedChannel } from "discord";

/**
 * Attempts to send a message to a channel.
 *
 * @param message - The message to send.
 * @param channel - The channel to send the message to.
 * @returns A promise that resolves to a boolean indicating whether the message was sent.
 */
export async function tryToSendMessageToChannel(
  message: string,
  channel: TextBasedChannel | null,
): Promise<Message | undefined> {
  if (channel === null) {
    console.warn("Could not send a message to an invalid channel");
    return undefined;
  }

  try {
    return await channel.send(message);
  } catch (err) {
    console.warn(
      `Failed to send a message to the channel: ${getErrorMessage(err)}`,
    );
    return undefined;
  }
}
