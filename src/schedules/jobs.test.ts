import { jest } from "@jest/globals";

describe("handle a job subscription", () => {
  const tryToFetchRssFeedFromUrl = jest.fn<any>();
  const tryToSendMessageToChannel = jest.fn<any>();

  beforeAll(() => {
    jest.unstable_mockModule("../feed.js", () => ({
      // Mock the RSS feed item to be formatted with just the item's title.
      formatRssFeedItem: (item: { title: string }) => item.title,

      tryToFetchRssFeedFromUrl,
    }));

    jest.unstable_mockModule("../message.js", () => ({
      tryToSendMessageToChannel,
    }));

    // Mock the database for storing posted jobs.
    const postedJobs: string[] = [];
    jest.unstable_mockModule("../store/jobs.js", () => ({
      isJobPosted: (jobId: string) => postedJobs.includes(jobId),
      markJobAsPosted: async (jobId: string) => postedJobs.push(jobId),
    }));
  });

  beforeEach(() => {
    tryToFetchRssFeedFromUrl.mockClear();
    tryToSendMessageToChannel.mockClear().mockResolvedValue(true);
  });

  it("should send all job information to the channel", async () => {
    const { handleJobSubscription } = await import("./jobs.js");

    tryToFetchRssFeedFromUrl.mockResolvedValue([
      { title: "First Job", guid: "1" },
      { title: "Second Job", guid: "2" },
    ]);

    await handleJobSubscription("some URL", "some channel" as any);

    expect(tryToFetchRssFeedFromUrl.mock.calls).toEqual([["some URL"]]);

    // Expect to send all job information to the channel because they all have
    // not been posted.
    expect(tryToSendMessageToChannel.mock.calls).toEqual([
      ["First Job", "some channel"],
      ["Second Job", "some channel"],
    ]);
  });

  it("should not send any job information to the channel", async () => {
    const { handleJobSubscription } = await import("./jobs.js");

    tryToFetchRssFeedFromUrl.mockResolvedValue([
      { title: "Second Job", guid: "2" },
    ]);

    await handleJobSubscription("some URL", "some channel" as any);

    expect(tryToFetchRssFeedFromUrl.mock.calls).toEqual([["some URL"]]);

    // Expect to not send any job information to the channel because they all
    // have already been posted.
    expect(tryToSendMessageToChannel.mock.calls).toEqual([]);
  });

  it("should only send new job information to the channel", async () => {
    const { handleJobSubscription } = await import("./jobs.js");

    tryToFetchRssFeedFromUrl.mockResolvedValue([
      { title: "Second Job", guid: "2" },
      { title: "Third Job", guid: "3" },
    ]);

    await handleJobSubscription("some URL", "some channel" as any);

    expect(tryToFetchRssFeedFromUrl.mock.calls).toEqual([["some URL"]]);

    // Expect to only send new job information to the channel because some
    // others have already been posted.
    expect(tryToSendMessageToChannel.mock.calls).toEqual([
      ["Third Job", "some channel"],
    ]);
  });
});
