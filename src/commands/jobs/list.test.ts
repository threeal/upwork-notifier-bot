import { jest } from "@jest/globals";

const tryToFetchRssFeedFromUrl = jest.fn<any>();
const tryToSendMessageToChannel = jest.fn<any>();
const interactionReply = jest.fn<any>();

beforeAll(() => {
  jest.unstable_mockModule("../../feed.js", () => ({
    // Mock the RSS feed item to be formatted with just the item's title.
    formatRssFeedItem: (item: { title: string }) => item.title,

    tryToFetchRssFeedFromUrl,
  }));

  jest.unstable_mockModule("../../message.js", () => ({
    tryToSendMessageToChannel,
  }));
});

describe("list jobs from an empty URL", () => {
  beforeAll(() => {
    tryToSendMessageToChannel.mockClear();
    interactionReply.mockClear();
  });

  it("should execute the command successfully", async () => {
    const ListJobsCommand = (await import("./list.js")).default;

    // Execute the command with a mocked interaction.
    await ListJobsCommand.execute({
      options: {
        getString: () => null,
      },
      reply: interactionReply,
    } as any);
  });

  it("should reply with the correct message", () => {
    expect(interactionReply.mock.calls).toEqual([
      ["The `url` option is required to list jobs"],
    ]);
  });

  it("should not send any messages to any channels", () => {
    expect(tryToSendMessageToChannel.mock.calls).toEqual([]);
  });
});

describe("list jobs from an RSS feed URL", () => {
  beforeAll(() => {
    tryToFetchRssFeedFromUrl.mockClear().mockResolvedValue([
      { title: "First Job", guid: "1" },
      { title: "Second Job", guid: "2" },
    ]);

    tryToSendMessageToChannel.mockClear();
    interactionReply.mockClear();
  });

  it("should execute the command successfully", async () => {
    const ListJobsCommand = (await import("./list.js")).default;

    // Execute the command with a mocked interaction.
    await ListJobsCommand.execute({
      channel: "some channel",
      options: {
        getString: (key: string) => (key === "url" ? "some URL" : ""),
      },
      reply: interactionReply,
    } as any);
  });

  it("should fetch jobs from the correct URL", () => {
    expect(tryToFetchRssFeedFromUrl.mock.calls).toEqual([["some URL"]]);
  });

  it("should reply with the correct message", () => {
    expect(interactionReply.mock.calls).toEqual([["Listing 2 jobs:"]]);
  });

  it("should send the correct messages to the channel", () => {
    expect(tryToSendMessageToChannel.mock.calls).toEqual([
      ["First Job", "some channel"],
      ["Second Job", "some channel"],
    ]);
  });
});
