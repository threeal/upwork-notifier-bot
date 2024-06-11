import { jest } from "@jest/globals";

// Mock the database.
const db = new (class {
  data: string[] = [];
  update(fn: (data: string[]) => void) {
    fn(this.data);
  }
})();
jest.unstable_mockModule("./db.js", () => ({ default: db }));

it("should checks whether a job has already been posted", async () => {
  const { isJobPosted } = await import("./jobs.js");

  expect(isJobPosted("some-job")).toBe(false);

  db.update((data) => data.push("some-job"));
  expect(isJobPosted("some-job")).toBe(true);
});

it("should checks whether an undefined job has already been posted", async () => {
  const { isJobPosted } = await import("./jobs.js");

  expect(isJobPosted(undefined)).toBe(false);
});
