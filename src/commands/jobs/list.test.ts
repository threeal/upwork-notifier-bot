import { jest } from "@jest/globals";

it("should list jobs from the given RSS feed URL", async () => {
  jest.unstable_mockModule("../../feed.js", () => ({
    // Mock the RSS feed item to be formatted with just the item's title.
    formatRssFeedItem: (item: { title: string }) => item.title,

    // Mock the RSS feed items that will be fetched.
    tryToFetchRssFeedFromUrl: async (url: string) => {
      if (url === "https://www.upwork.com/some-rss") {
        return [
          { title: "First Job", guid: "1" },
          { title: "Second Job", guid: "2" },
        ];
      }
      return [];
    },
  }));

  // Mock the function for sending the message.
  const tryToSendMessageToChannel = jest.fn();
  jest.unstable_mockModule("../../message.js", () => ({
    tryToSendMessageToChannel,
  }));

  // Construct a mocked interaction.
  const interaction = {
    channel: {},
    options: {
      getString: (key: string) => {
        if (key === "url") return "https://www.upwork.com/some-rss";
        return "";
      },
    },
    reply: jest.fn(),
  };

  // Execute the command with a mocked interaction.
  const ListJobsCommand = (await import("./list.js")).default;
  await ListJobsCommand.execute(interaction as any);

  // Expect to reply with the correct message.
  expect(interaction.reply.mock.calls).toEqual([[`Listing 2 jobs:`]]);

  // Expect to send the correct messages to the channel.
  expect(tryToSendMessageToChannel.mock.calls).toEqual([
    ["First Job", interaction.channel],
    ["Second Job", interaction.channel],
  ]);
});
