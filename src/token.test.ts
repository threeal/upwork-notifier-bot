import { Readable } from "node:stream";
import { getToken } from "./token.js";

it("should retrieve a Discord bot token from the environment variables", async () => {
  process.env["BOT_TOKEN"] = "some-token";
  await expect(getToken()).resolves.toBe("some-token");
});

it("should retrieve a Discord bot token from user input", async () => {
  delete process.env["BOT_TOKEN"];
  Object.defineProperty(process, "stdin", {
    value: Readable.from(["some-token\n"]),
  });
  await expect(getToken()).resolves.toBe("some-token");
});
