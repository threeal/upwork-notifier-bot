import { getToken } from "./token.js";

it("should retrieve a Discord bot token", () => {
  process.env["BOT_TOKEN"] = "some-token";
  expect(getToken()).toBe("some-token");
});
