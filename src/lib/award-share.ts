/**
 * URL construction for the award page's sharing controls.
 *
 * These live apart from the page because they are the part of it that cannot
 * be checked by looking: a share button either opens a composer with the
 * right text in it or it opens an error, and which one it does is decided by
 * a query string that is unreadable once encoded. Pulling them out of the
 * component makes them ordinary functions with a test each, so a typo in a
 * parameter name fails the build instead of being found by an author who
 * clicked the button we asked them to click.
 */

/** Structural, not the full record from people.json: these builders need
 *  three strings and nothing else, and saying so keeps them testable without
 *  a board number and a URL in every fixture. */
export type SummarisablePaper = {
  award: string;
  title: string;
  authors: string;
};

export type ShareTarget = {
  name: string;
  href: string;
};

/**
 * The sentence used as the page's meta description, the text put into a post,
 * and the summary shown on the page. One string for all three: they say the
 * same thing, and three copies would be three things to keep in step.
 *
 * `edition` names which LIMIT this was — "4th LIMIT Workshop @ ECCV 2026" —
 * and comes from workshop.json rather than being written in here. The
 * workshop has run four times and this sentence is what a reader of a post
 * has to date the award by; a hardcoded name would have to be found in the
 * source and changed for the fifth.
 *
 * Curly quotes rather than straight ones because this is prose, and it is
 * read as prose in a feed. They survive percent-encoding like any other
 * non-ASCII character.
 */
export function buildAwardSummary(
  paper: SummarisablePaper,
  edition: string,
): string {
  return `${paper.award} at the ${edition}: “${paper.title}” by ${paper.authors}.`;
}

/**
 * Composer links for the three networks.
 *
 * X and Bluesky take the text; LinkedIn deliberately does not. LinkedIn
 * dropped support for prefilled text years ago and builds its preview from
 * the destination's Open Graph tags instead, so anything passed alongside the
 * URL is discarded. That is why the award page is prerendered.
 *
 * Bluesky has no separate url parameter, so the link goes inside the text.
 */
export function buildShareTargets(summary: string, url: string): ShareTarget[] {
  return [
    {
      name: "X",
      href: `https://x.com/intent/post?text=${encodeURIComponent(
        `${summary} #ECCV2026`,
      )}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}`,
    },
    {
      name: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodeURIComponent(
        `${summary} ${url}`,
      )}`,
    },
  ];
}

export type CertificationInput = {
  /** Shown as the certification's name on the profile. */
  name: string;
  /** The issuing body. */
  organization: string;
  issueYear: number;
  /** 1-indexed, as LinkedIn expects: September is 9. */
  issueMonth: number;
  /** Where a reader of the profile is sent to check the claim. */
  certUrl: string;
};

/**
 * LinkedIn's prefilled certification form. The award lands in the Licenses &
 * Certifications section with certUrl pointing back at the award page, which
 * is what turns a line on a profile into something a reader can check.
 *
 * startTask=CERTIFICATION_NAME is what puts the form into that section;
 * without it LinkedIn opens the profile and ignores the rest.
 */
export function buildLinkedInCertificationUrl(
  input: CertificationInput,
): string {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: input.name,
    organizationName: input.organization,
    issueYear: String(input.issueYear),
    issueMonth: String(input.issueMonth),
    certUrl: input.certUrl,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
