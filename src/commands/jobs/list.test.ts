import { jest } from "@jest/globals";
import { CacheType, ChatInputCommandInteraction } from "discord";
import { formatRssFeedItem } from "../../feed.js";

const rssFeedItems = [
  {
    title: "First Job",
    link: "https://www.upwork.com/link-to-first-job",
    contentSnippet: "Description of the first job",
    guid: "1",
  },
  {
    title: "Second Job",
    link: "https://www.upwork.com/link-to-second-job",
    contentSnippet: "Description of the second job",
    guid: "2",
  },
];

jest.unstable_mockModule("../../feed.js", () => ({
  formatRssFeedItem: formatRssFeedItem,
  tryToFetchRssFeedFromUrl: async (url: string) => {
    if (url === "https://www.upwork.com/some-rss") {
      return rssFeedItems;
    }
    return [];
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
  expect(interaction.reply).toHaveBeenLastCalledWith(
    `Listing ${rssFeedItems.length} jobs:`,
  );

  expect(interaction.channel.send).toHaveBeenCalledTimes(rssFeedItems.length);
  expect(interaction.channel.send.mock.calls).toEqual(
    rssFeedItems.map((item) => [formatRssFeedItem(item)]),
  );
});
