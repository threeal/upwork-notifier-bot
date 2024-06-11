import db from "./db.js";

/**
 * Checks whether a job with a specific ID has already been posted.
 *
 * @param jobId - The ID of the job.
 * @returns True if the job has already been posted, otherwise false.
 */
export function isJobPosted(jobId: string | undefined): boolean {
  if (jobId === undefined) return false;
  return db.data.includes(jobId);
}

/**
 * Marks a job with a specific ID as posted.
 *
 * @param jobId - The ID of the job.
 * @returns A promise that resolves to nothing.
 */
export async function markJobAsPosted(
  jobId: string | undefined,
): Promise<void> {
  if (jobId !== undefined) {
    await db.update((data) => data.push(jobId));
  }
}
