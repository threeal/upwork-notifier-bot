import { jest } from "@jest/globals";
import { pino } from "pino";
import pinoTest from "pino-test";

const stream = pinoTest.sink();
jest.unstable_mockModule("./logger.js", () => ({
  default: pino(stream),
}));

it("should not send a message to an invalid channel", async () => {
  const { tryToSendMessageToChannel } = await import("./message.js");

  const prom = tryToSendMessageToChannel("some message", null);
  await expect(prom).resolves.toBe(false);

  await pinoTest.once(stream, {
    level: 40,
    msg: "Could not send a message to an invalid channel",
  });
});

it("should send a message to a channel", async () => {
  const { tryToSendMessageToChannel } = await import("./message.js");

  const channel = { send: jest.fn() };

  const prom = tryToSendMessageToChannel("some message", channel as any);
  await expect(prom).resolves.toBe(true);

  expect(channel.send).toHaveBeenCalledTimes(1);
  expect(channel.send).toHaveBeenLastCalledWith("some message");
});

it("should failed to send a message to a channel", async () => {
  const { tryToSendMessageToChannel } = await import("./message.js");

  const channel = {
    send: jest.fn(async () => {
      throw new Error("some error");
    }),
  };

  const prom = tryToSendMessageToChannel("some message", channel as any);
  await expect(prom).resolves.toBe(false);

  await pinoTest.once(stream, {
    level: 40,
    msg: "Failed to send a message to the channel: some error",
  });
});

afterAll(async () => {
  const logger = (await import("./logger.js")).default;

  logger.info("stream ended");
  await pinoTest.once(stream, { level: 30, msg: "stream ended" });
});
