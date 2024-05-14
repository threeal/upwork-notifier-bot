import { CacheType, ChatInputCommandInteraction } from "discord";
import { jest } from "@jest/globals";

jest.unstable_mockModule("rss-parser", () => ({
  default: class {
    async parseURL(url: string) {
      if (url === "https://www.upwork.com/some-rss") {
        return {
          items: [
            {
              title: "First Job",
              link: "https://www.upwork.com/link-to-first-job",
              contentSnippet: "Description of the first job",
            },
            {
              title: "Second Job",
              link: "https://www.upwork.com/link-to-second-job",
              contentSnippet: "Description of the second job",
            },
          ],
        };
      }
    }
  },
}));

const interaction = {
  channel: {
    send: jest.fn(),
  },
  options: {
    getString: (key: string) => {
      return key === "url" ? "https://www.upwork.com/some-rss" : "";
    },
  },
  reply: jest.fn(),
};

it("should list jobs from the given RSS feed URL", async () => {
  const ListJobsCommand = (await import("./list.js")).default;

  await ListJobsCommand.execute(
    interaction as unknown as ChatInputCommandInteraction<CacheType>,
  );

  expect(interaction.reply).toHaveBeenCalledTimes(1);
  expect(interaction.reply).toHaveBeenLastCalledWith("Listing 2 jobs:");

  expect(interaction.channel.send).toHaveBeenCalledTimes(2);
  expect(interaction.channel.send.mock.calls).toEqual([
    [
      "**First Job**\n\n<https://www.upwork.com/link-to-first-job>\n\nDescription of the first job",
    ],
    [
      "**Second Job**\n\n<https://www.upwork.com/link-to-second-job>\n\nDescription of the second job",
    ],
  ]);
});
