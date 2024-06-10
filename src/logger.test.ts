import { createTempDirectory, ITempDirectory } from "create-temp-directory";
import { glob } from "glob";
import sleep from "sleep-promise";

let tempDir: ITempDirectory | undefined = undefined;

it("should create a log file in the current working directory", async () => {
  tempDir = await createTempDirectory();
  process.chdir(tempDir.path);

  // Expect there to be no log files in the current working directory.
  expect(await glob("*.log")).toHaveLength(0);

  await import("./logger.js");

  // Wait 1 second and expect a log file in the current working directory.
  await sleep(1000);
  expect(await glob("*.log")).toHaveLength(1);
});

afterAll(async () => {
  if (tempDir !== undefined) await tempDir.remove();
});
