import { bold, hideLinkEmbed } from "discord";
import { formatRssFeedItem } from "./feed.js";

it("should format an RSS feed item", () => {
  expect(
    formatRssFeedItem({
      title: "Some Job",
      link: "https://www.upwork.com/link-to-some-job",
      contentSnippet: "Description of the job",
    }),
  ).toBe(
    [
      bold("Some Job"),
      "Description of the job",
      hideLinkEmbed("https://www.upwork.com/link-to-some-job"),
    ].join("\n\n"),
  );
});

it("should format an RSS feed item with undefined properties", () => {
  expect(formatRssFeedItem({})).toBe("**Unknown Job**");
});
