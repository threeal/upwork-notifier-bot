import { jest } from "@jest/globals";

it("should subscribe jobs from the given RSS feed URL", async () => {
  jest.useFakeTimers();

  // Construct the RSS feed items that will be fetched.
  const rssFeedItems = [
    { title: "First Job", guid: "1" },
    { title: "Second Job", guid: "2" },
    { title: "Third Job", guid: "3" },
  ];

  jest.unstable_mockModule("../../feed.js", () => ({
    // Mock the RSS feed item to be formatted with just the item's title.
    formatRssFeedItem: (item: { title: string }) => item.title,

    // Mock the RSS feed items that will be fetched.
    tryToFetchRssFeedFromUrl: async (url: string) => {
      if (url === "https://www.upwork.com/some-rss") return rssFeedItems;
      return [];
    },
  }));

  // Mock the function for sending the message.
  const tryToSendMessageToChannel = jest.fn().mockReturnValue(true);
  jest.unstable_mockModule("../../message.js", () => ({
    tryToSendMessageToChannel,
  }));

  // Mock the database for storing posted jobs.
  jest.unstable_mockModule("../../store/jobs.js", () => {
    // Initialize the job with ID `2` to be already posted.
    const postedJobs: string[] = ["2"];

    return {
      isJobPosted: (jobId: string) => postedJobs.includes(jobId),
      markJobAsPosted: async (jobId: string) => postedJobs.push(jobId),
    };
  });

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
  const SubscribeJobsCommand = (await import("./subscribe.js")).default;
  await SubscribeJobsCommand.execute(interaction as any);

  // Expect to reply with the correct message.
  expect(interaction.reply.mock.calls).toEqual([
    ["Subscribed to: <https://www.upwork.com/some-rss>"],
  ]);

  // Expect to send the correct messages to the channel.
  expect(tryToSendMessageToChannel.mock.calls).toEqual([
    ["First Job", interaction.channel],
    ["Third Job", interaction.channel],
  ]);

  // Advance the time without updating the RSS feed items.
  tryToSendMessageToChannel.mockClear();
  await jest.advanceTimersByTimeAsync(60000);

  // Expect to send no messages to the channel.
  expect(tryToSendMessageToChannel.mock.calls).toEqual([]);

  // Advance the time with updating the RSS feed items.
  rssFeedItems.push({ title: "Fourth Job", guid: "4" });
  tryToSendMessageToChannel.mockClear();
  await jest.advanceTimersByTimeAsync(60000);

  // Expect to only send the new messages to the channel.
  expect(tryToSendMessageToChannel.mock.calls).toEqual([
    ["Fourth Job", interaction.channel],
  ]);
});
