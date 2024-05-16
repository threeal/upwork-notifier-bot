import { formatRssFeedItem } from "./feed.js";

it("should format a RSS feed item", () => {
  expect(
    formatRssFeedItem({
      title: "Some Job",
      link: "https://www.upwork.com/link-to-some-job",
      contentSnippet: "Description of the job",
    }),
  ).toBe(
    "**Some Job**\n\n<https://www.upwork.com/link-to-some-job>\n\nDescription of the job",
  );
});
