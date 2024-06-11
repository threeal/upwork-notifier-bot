import { jest } from "@jest/globals";

// Mock the database.
jest.unstable_mockModule("./db.js", () => ({
  default: new (class {
    data: string[] = [];
    async update(fn: (data: string[]) => void) {
      fn(this.data);
    }
  })(),
}));

it("should checks whether a job has already been posted", async () => {
  const { isJobPosted, markJobAsPosted } = await import("./jobs.js");

  expect(isJobPosted("some-job")).toBe(false);

  await markJobAsPosted("some-job");
  expect(isJobPosted("some-job")).toBe(true);
});

it("should checks whether an undefined job has already been posted", async () => {
  const { isJobPosted, markJobAsPosted } = await import("./jobs.js");

  expect(isJobPosted(undefined)).toBe(false);

  await markJobAsPosted(undefined);
  expect(isJobPosted(undefined)).toBe(false);
});
