import peopleData from "@/data/people.json";

/**
 * Which paper won, resolved once for everything that needs to know.
 *
 * A prize is recorded on the paper that won it in people.json, not in a list
 * of winners of its own, so the home page's award section and the paper's row
 * in Accepted Papers cannot come to disagree about the title or the authors.
 * Only the winning entry carries the two extra keys, so the union has to be
 * narrowed before either can be read, and that narrowing lives here rather
 * than being written out again in each route that wants it.
 */

type AcceptedPaper = (typeof peopleData.program.acceptedPapers)[number];

export type AwardedPaper = Extract<AcceptedPaper, { award: string }>;

export const isAwarded = (paper: AcceptedPaper): paper is AwardedPaper =>
  "award" in paper && paper.award !== "";

/** Written for any number of winners: an honourable mention would be one more
 *  flagged paper, not a second code path. */
export const awardedPapers =
  peopleData.program.acceptedPapers.filter(isAwarded);
