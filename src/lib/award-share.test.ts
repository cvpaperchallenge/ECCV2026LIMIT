import { describe, expect, it } from "vitest";

import {
  buildAwardSummary,
  buildLinkedInCertificationUrl,
  buildShareTargets,
} from "./award-share";

/**
 * The award data as it stands, including the characters that make these URLs
 * worth testing: an umlaut in an author's name, curly quotes in the summary,
 * and a title with "+" in it, which is the character percent-encoding is
 * most often got wrong for — a raw "+" in a query string decodes to a space.
 */
const paper = {
  award: "Best Paper Award",
  title: "RIPE++: Reinforced Keypoint Learning from Positive Pairs Only",
  authors: "Johannes Künzel, Peter Eisert, Anna Hilsmann",
};

const AWARD_URL =
  "https://eccv2026-limit-workshop.limitlab.xyz/best-paper-award";

describe("buildAwardSummary", () => {
  it("names the award, the paper and the authors", () => {
    const summary = buildAwardSummary(paper);

    expect(summary).toContain("Best Paper Award");
    expect(summary).toContain(paper.title);
    expect(summary).toContain(paper.authors);
    expect(summary).toContain("LIMIT Workshop @ ECCV 2026");
  });
});

describe("buildShareTargets", () => {
  const summary = buildAwardSummary(paper);
  const targets = buildShareTargets(summary, AWARD_URL);
  const byName = Object.fromEntries(targets.map((t) => [t.name, t.href]));

  it("offers exactly the three networks the page renders", () => {
    expect(targets.map((t) => t.name)).toEqual(["X", "LinkedIn", "Bluesky"]);
  });

  it.each(Object.entries(byName))(
    "%s builds a parseable https URL",
    (_, href) => {
      const url = new URL(href);
      expect(url.protocol).toBe("https:");
    },
  );

  it("posts to the composer endpoints, not to an API", () => {
    expect(new URL(byName.X).origin + new URL(byName.X).pathname).toBe(
      "https://x.com/intent/post",
    );
    expect(
      new URL(byName.LinkedIn).origin + new URL(byName.LinkedIn).pathname,
    ).toBe("https://www.linkedin.com/sharing/share-offsite/");
    expect(
      new URL(byName.Bluesky).origin + new URL(byName.Bluesky).pathname,
    ).toBe("https://bsky.app/intent/compose");
  });

  it("round-trips the summary through X's text parameter", () => {
    // Decoding the parameter has to give back exactly what went in. If "+"
    // or the umlaut were encoded wrongly this is where it shows: the "++" in
    // the title would come back as two spaces.
    const text = new URL(byName.X).searchParams.get("text");

    expect(text).toBe(`${summary} #ECCV2026`);
    expect(text).toContain("RIPE++:");
    expect(text).toContain("Künzel");
  });

  it("sends X the award URL as a separate parameter", () => {
    expect(new URL(byName.X).searchParams.get("url")).toBe(AWARD_URL);
  });

  it("sends LinkedIn the URL and no text, which it would ignore", () => {
    const params = new URL(byName.LinkedIn).searchParams;

    expect(params.get("url")).toBe(AWARD_URL);
    expect(params.get("text")).toBeNull();
    expect(params.get("summary")).toBeNull();
  });

  it("puts the URL inside Bluesky's text, which has no url parameter", () => {
    const params = new URL(byName.Bluesky).searchParams;

    expect(params.get("url")).toBeNull();
    expect(params.get("text")).toBe(`${summary} ${AWARD_URL}`);
    expect(params.get("text")).toContain(AWARD_URL);
  });

  it("keeps the hashtag a hashtag rather than a URL fragment", () => {
    // A bare "#" in a query string starts the fragment and would truncate
    // the post text at that point, silently dropping the tag.
    expect(byName.X).not.toContain("#");
    expect(new URL(byName.X).hash).toBe("");
    expect(new URL(byName.X).searchParams.get("text")).toContain("#ECCV2026");
  });
});

describe("buildLinkedInCertificationUrl", () => {
  const href = buildLinkedInCertificationUrl({
    name: "Best Paper Award — LIMIT Workshop @ ECCV 2026",
    organization: "LIMIT Workshop @ ECCV 2026",
    issueYear: 2026,
    issueMonth: 9,
    certUrl: AWARD_URL,
  });
  const url = new URL(href);

  it("targets LinkedIn's add-to-profile endpoint", () => {
    expect(url.origin + url.pathname).toBe(
      "https://www.linkedin.com/profile/add",
    );
  });

  it("asks for the certifications section by name", () => {
    // Without startTask LinkedIn opens the profile and drops everything else,
    // which looks like the button doing nothing.
    expect(url.searchParams.get("startTask")).toBe("CERTIFICATION_NAME");
  });

  it("fills in the award, the issuer and the date", () => {
    expect(url.searchParams.get("name")).toBe(
      "Best Paper Award — LIMIT Workshop @ ECCV 2026",
    );
    expect(url.searchParams.get("organizationName")).toBe(
      "LIMIT Workshop @ ECCV 2026",
    );
    expect(url.searchParams.get("issueYear")).toBe("2026");
  });

  it("gives September as 9, LinkedIn's months being 1-indexed", () => {
    expect(url.searchParams.get("issueMonth")).toBe("9");
  });

  it("points certUrl back at the award page so the claim can be checked", () => {
    expect(url.searchParams.get("certUrl")).toBe(AWARD_URL);
  });

  it("encodes the em dash and the @ rather than emitting them raw", () => {
    expect(href).not.toContain("—");
    expect(href).toContain("%E2%80%94");
  });
});
