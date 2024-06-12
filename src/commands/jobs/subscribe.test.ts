import { jest } from "@jest/globals";

describe("subscribe jobs from an RSS feed URL", () => {
  const handleJobSubscription = jest.fn<any>();

  beforeAll(() => {
    jest.useFakeTimers();

    jest.unstable_mockModule("../../schedules/jobs.js", () => ({
      handleJobSubscription,
    }));
  });

  it("should reply with the correct message", async () => {
    const SubscribeJobsCommand = (await import("./subscribe.js")).default;

    const interaction = {
      channel: "some channel",
      options: {
        getString: (key: string) => (key === "url" ? "some URL" : ""),
      },
      reply: jest.fn(),
    };

    await SubscribeJobsCommand.execute(interaction as any);

    // Expect to reply with the correct message.
    expect(interaction.reply.mock.calls).toEqual([
      ["Subscribed to: <some URL>"],
    ]);

    // Expect to handle the job subscription immediately.
    expect(handleJobSubscription.mock.calls).toEqual([
      ["some URL", "some channel"],
    ]);
  });

  it("should handle the job subscription every second", async () => {
    for (let i = 0; i < 10; ++i) {
      handleJobSubscription.mockClear();
      await jest.advanceTimersByTimeAsync(60000);
      expect(handleJobSubscription.mock.calls).toEqual([
        ["some URL", "some channel"],
      ]);
    }
  });
});
