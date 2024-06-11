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
