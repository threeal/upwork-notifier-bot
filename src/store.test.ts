import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import fs from "node:fs/promises";

let tempDir: ITempDirectory | undefined = undefined;

it("should create a database file in the current working directory", async () => {
  tempDir = await createTempDirectory();
  process.chdir(tempDir.path);

  // Expect there to be no database file in the current working directory.
  await expect(fs.access("db.json", fs.constants.F_OK)).rejects.toThrow();

  await import("./store.js");

  // Expect there to be a database file in the current working directory.
  await fs.access("db.json", fs.constants.F_OK);
});

afterAll(async () => {
  if (tempDir !== undefined) await tempDir.remove();
});
