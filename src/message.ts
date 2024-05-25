import { getErrorMessage } from "catched-error-message";
import { TextBasedChannel } from "discord";

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
): Promise<boolean> {
  if (channel === null) {
    console.warn("Could not send a message to an invalid channel");
    return false;
  }

  try {
    await channel.send(message);
    return true;
  } catch (err) {
    console.warn(
      `Failed to send a message to the channel: ${getErrorMessage(err)}`,
    );
    return false;
  }
}
