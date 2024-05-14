import { CacheType, ChatInputCommandInteraction } from "discord";
import ScheduleCommand from "./schedule.js";

const interaction = {
  channel: {
    send: jest.fn(),
  },
  options: {
    getString: jest.fn(),
  },
  reply: jest.fn(),
};

it("should schedule a message to be sent later", async () => {
  interaction.options.getString.mockImplementation((key: string) => {
    return key === "message" ? "some message" : "";
  });

  ScheduleCommand.execute(
    interaction as unknown as ChatInputCommandInteraction<CacheType>,
  );

  expect(interaction.reply).toHaveBeenCalledTimes(1);
  expect(interaction.reply).toHaveBeenLastCalledWith(
    `Scheduled "some message" in 10 seconds`,
  );

  expect(interaction.channel.send).toHaveBeenCalledTimes(0);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  expect(interaction.channel.send).toHaveBeenCalledTimes(1);
  expect(interaction.channel.send).toHaveBeenLastCalledWith("some message");
}, 15000);
