import { jest } from "@jest/globals";
import { tryToSendMessageToChannel } from "./message.js";

const mockedConsoleWarning = jest.spyOn(console, "warn").mockReset();

it.concurrent("should not send a message to an invalid channel", async () => {
  const prom = tryToSendMessageToChannel("some message", null);
  await expect(prom).resolves.toBe(false);

  expect(mockedConsoleWarning).toHaveBeenCalledWith(
    "Could not send a message to an invalid channel",
  );
});

it.concurrent("should send a message to a channel", async () => {
  const channel = { send: jest.fn() };

  const prom = tryToSendMessageToChannel("some message", channel as any);
  await expect(prom).resolves.toBe(true);

  expect(channel.send).toHaveBeenCalledTimes(1);
  expect(channel.send).toHaveBeenLastCalledWith("some message");
});

it.concurrent("should failed to send a message to a channel", async () => {
  const channel = {
    send: jest.fn(async () => {
      throw new Error("some error");
    }),
  };

  const prom = tryToSendMessageToChannel("some message", channel as any);
  await expect(prom).resolves.toBe(false);

  expect(mockedConsoleWarning).toHaveBeenLastCalledWith(
    "Failed to send a message to the channel: some error",
  );
});
