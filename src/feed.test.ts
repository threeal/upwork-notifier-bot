import { formatRssFeedItem } from "./feed.js";

it("should format an RSS feed item", () => {
  expect(
    formatRssFeedItem({
      title: "Some Job",
      link: "https://www.upwork.com/link-to-some-job",
      contentSnippet: "Description of the job",
    }),
  ).toBe(
    "**Some Job**\n\nDescription of the job\n\n<https://www.upwork.com/link-to-some-job>",
  );
});

it("should format an RSS feed item with undefined properties", () => {
  expect(formatRssFeedItem({})).toBe("**Unknown Job**");
});
