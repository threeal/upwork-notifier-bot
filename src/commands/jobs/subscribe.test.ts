import { jest } from "@jest/globals";
import { CacheType, ChatInputCommandInteraction } from "discord";

jest.useFakeTimers();

const rssFeedItems = [
  { title: "First Job", guid: "1" },
  { title: "Second Job", guid: "2" },
  { title: "Third Job", guid: "3" },
];

jest.unstable_mockModule("../../feed.js", () => ({
  formatRssFeedItem: (item: { title: string }) => item.title,
  tryToFetchRssFeedFromUrl: async (url: string) => {
    if (url === "https://www.upwork.com/some-rss") {
      return rssFeedItems;
    }
    return [];
  },
}));

jest.unstable_mockModule("../../store.js", () => ({
  default: new (class {
    data: string[] = [];
    update(fn: (data: string[]) => void) {
      fn(this.data);
    }
  })(),
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
  const store = (await import("../../store.js")).default;

  // Initialize the job with GUID `2` to be already listed.
  store.update((data) => data.push("2"));

  await SubscribeJobsCommand.execute(
    interaction as unknown as ChatInputCommandInteraction<CacheType>,
  );

  expect(interaction.reply).toHaveBeenCalledTimes(1);
  expect(interaction.reply).toHaveBeenLastCalledWith(
    "Subscribed to: <https://www.upwork.com/some-rss>",
  );

  expect(interaction.channel.send.mock.calls).toEqual([
    ["First Job"],
    ["Third Job"],
  ]);

  await jest.advanceTimersByTimeAsync(60000);

  expect(interaction.channel.send.mock.calls).toEqual([
    ["First Job"],
    ["Third Job"],
  ]);

  rssFeedItems.push({ title: "Fourth Job", guid: "4" });
  await jest.advanceTimersByTimeAsync(60000);

  expect(interaction.channel.send.mock.calls).toEqual([
    ["First Job"],
    ["Third Job"],
    ["Fourth Job"],
  ]);
});
