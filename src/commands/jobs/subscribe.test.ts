import { jest } from "@jest/globals";
import { CacheType, ChatInputCommandInteraction } from "discord";
import { formatRssFeedItem } from "../../feed.js";

jest.useFakeTimers();

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

jest.unstable_mockModule("rss-parser", () => ({
  default: class {
    async parseURL(url: string) {
      if (url === "https://www.upwork.com/some-rss") {
        return { items: rssFeedItems };
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

it("should subscribe jobs from the given RSS feed URL", async () => {
  const SubscribeJobsCommand = (await import("./subscribe.js")).default;

  await SubscribeJobsCommand.execute(
    interaction as unknown as ChatInputCommandInteraction<CacheType>,
  );

  expect(interaction.reply).toHaveBeenCalledTimes(1);
  expect(interaction.reply).toHaveBeenLastCalledWith(
    "Subscribed to: <https://www.upwork.com/some-rss>",
  );

  expect(interaction.channel.send).toHaveBeenCalledTimes(rssFeedItems.length);
  expect(interaction.channel.send.mock.calls).toEqual(
    rssFeedItems.map((item) => [formatRssFeedItem(item)]),
  );

  await jest.advanceTimersByTimeAsync(60000);

  expect(interaction.channel.send).toHaveBeenCalledTimes(rssFeedItems.length);
  expect(interaction.channel.send.mock.calls).toEqual(
    rssFeedItems.map((item) => [formatRssFeedItem(item)]),
  );

  rssFeedItems.push({
    title: "Third Job",
    link: "https://www.upwork.com/link-to-third-job",
    contentSnippet: "Description of the third job",
    guid: "3",
  });
  await jest.advanceTimersByTimeAsync(60000);

  expect(interaction.channel.send).toHaveBeenCalledTimes(rssFeedItems.length);
  expect(interaction.channel.send.mock.calls).toEqual(
    rssFeedItems.map((item) => [formatRssFeedItem(item)]),
  );
});
