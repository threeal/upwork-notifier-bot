import { jest } from "@jest/globals";

const handleJobSubscription = jest.fn<any>();
const interactionReply = jest.fn<any>();

beforeAll(() => {
  jest.unstable_mockModule("../../schedules/jobs.js", () => ({
    handleJobSubscription,
  }));
});

describe("subscribe jobs from an empty URL", () => {
  beforeAll(() => {
    handleJobSubscription.mockClear();
    interactionReply.mockClear();
  });

  it("should execute the command successfully", async () => {
    const SubscribeJobsCommand = (await import("./subscribe.js")).default;

    // Execute the command with a mocked interaction.
    await SubscribeJobsCommand.execute({
      options: {
        getString: () => null,
      },
      reply: interactionReply,
    } as any);
  });

  it("should reply with the correct message", () => {
    expect(interactionReply.mock.calls).toEqual([
      ["The `url` option is required to subscribe to jobs"],
    ]);
  });

  it("should not handle the job subscription", () => {
    expect(handleJobSubscription.mock.calls).toEqual([]);
  });
});

describe("subscribe jobs from an RSS feed URL with an unavailable channel", () => {
  beforeAll(() => {
    handleJobSubscription.mockClear();
    interactionReply.mockClear();
  });

  it("should execute the command successfully", async () => {
    const SubscribeJobsCommand = (await import("./subscribe.js")).default;

    // Execute the command with a mocked interaction.
    await SubscribeJobsCommand.execute({
      channel: null,
      options: {
        getString: (key: string) => (key === "url" ? "some URL" : ""),
      },
      reply: interactionReply,
    } as any);
  });

  it("should reply with the correct message", () => {
    expect(interactionReply.mock.calls).toEqual([
      ["The destination channel is unavailable for sending the list of jobs."],
    ]);
  });

  it("should not handle the job subscription", () => {
    expect(handleJobSubscription.mock.calls).toEqual([]);
  });
});

describe("subscribe jobs from an RSS feed URL", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    handleJobSubscription.mockClear();
    interactionReply.mockClear();
  });

  it("should execute the command successfully", async () => {
    const SubscribeJobsCommand = (await import("./subscribe.js")).default;

    // Execute the command with a mocked interaction.
    await SubscribeJobsCommand.execute({
      channel: "some channel",
      options: {
        getString: (key: string) => (key === "url" ? "some URL" : ""),
      },
      reply: interactionReply,
    } as any);
  });

  it("should reply with the correct message", () => {
    expect(interactionReply.mock.calls).toEqual([
      ["Subscribed to: <some URL>"],
    ]);
  });

  it("should handle the job subscription immediately", () => {
    expect(handleJobSubscription.mock.calls).toEqual([
      ["some URL", "some channel"],
    ]);
  });

  it("should handle the job subscription every minute", async () => {
    for (let i = 0; i < 10; ++i) {
      handleJobSubscription.mockClear();
      await jest.advanceTimersByTimeAsync(60000);
      expect(handleJobSubscription.mock.calls).toEqual([
        ["some URL", "some channel"],
      ]);
    }
  });
});
