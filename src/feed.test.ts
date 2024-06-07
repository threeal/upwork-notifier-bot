import { jest } from "@jest/globals";
import { bold, hideLinkEmbed } from "discord";
import { formatRssFeedItem, tryToFetchRssFeedFromUrl } from "./feed.js";

const mockedConsoleWarning = jest.spyOn(console, "warn").mockReset();

beforeEach(() => {
  mockedConsoleWarning.mockClear();
});

it("should fetch RSS feed from a URL", async () => {
  const feed = await tryToFetchRssFeedFromUrl(
    "https://www.upwork.com/ab/feed/jobs/rss?q=some%20job",
  );
  expect(feed.length).toBeGreaterThan(0);
  expect(mockedConsoleWarning.mock.calls.length).toBe(0);
});

it("should fail to fetch RSS feed from an invalid URL", async () => {
  const feed = await tryToFetchRssFeedFromUrl("https://www.upwork.com");
  expect(feed.length).toBe(0);
  expect(mockedConsoleWarning).toHaveBeenLastCalledWith(
    "Failed to fetch RSS feed from 'https://www.upwork.com': Status code 403",
  );
});

it("should format an RSS feed item", () => {
  expect(
    formatRssFeedItem({
      title: "Some Job",
      link: "https://www.upwork.com/link-to-some-job",
      contentSnippet: [
        "Description of the job",
        "",
        "Another description of the job",
        "",
        "Budget: $100",
        "Hourly Range: $10.00-$20.00",
        "Posted On: Jan 1, 2020 00:00 UTC",
        "Category: some category",
        "Skills: some skill",
        "Country: some country",
        "click to apply",
      ].join("\n"),
    }),
  ).toBe(
    [
      `:mag_right: ${bold("Some Job")}`,
      [
        ":money_with_wings: Budget: $100",
        ":money_with_wings: Hourly Range: $10.00-$20.00",
        ":calendar_spiral: Posted On: Jan 1, 2020 00:00 UTC",
      ].join("\n"),
      "Description of the job\n\nAnother description of the job",
      `:link: ${hideLinkEmbed("https://www.upwork.com/link-to-some-job")}`,
      Array(18).fill(":four_leaf_clover:").join(""),
    ].join("\n\n"),
  );
});

it("should format an RSS feed item with undefined properties", () => {
  expect(formatRssFeedItem({})).toBe(
    [
      `:mag_right: ${bold("Unknown Job")}`,
      Array(18).fill(":four_leaf_clover:").join(""),
    ].join("\n\n"),
  );
});
