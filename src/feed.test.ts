import { bold, hideLinkEmbed } from "discord";
import { formatRssFeedItem } from "./feed.js";

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
      bold("Some Job"),
      [
        "Budget: $100",
        "Hourly Range: $10.00-$20.00",
        "Posted On: Jan 1, 2020 00:00 UTC",
      ].join("\n"),
      "Description of the job\n\nAnother description of the job",
      hideLinkEmbed("https://www.upwork.com/link-to-some-job"),
    ].join("\n\n"),
  );
});

it("should format an RSS feed item with undefined properties", () => {
  expect(formatRssFeedItem({})).toBe("**Unknown Job**");
});
