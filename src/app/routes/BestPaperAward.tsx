import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Linkedin,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "../../components/ui/button";
import certificateData from "../../data/award-certificates.json";
import workshopData from "../../data/workshop.json";
import type { Route } from "./+types/BestPaperAward";
import { awardedPapers } from "@/lib/award";
import {
  buildAwardSummary,
  buildLinkedInCertificationUrl,
  buildShareTargets,
} from "@/lib/award-share";
import { buildMeta, seoDefaults } from "@/lib/seo";

/**
 * The award's own page, and the URL the authors are meant to hand out.
 *
 * The home page already names the winner, so the reason this exists as a
 * route rather than an anchor is everything around the announcement. A
 * fragment is not a page to a crawler — `/#award` and `/` are the same
 * request, answered with the site's generic card — and it is not a page to
 * LinkedIn's certification field either, which wants somewhere a reader can
 * be sent to check the claim. Both need a path of their own, and this is it.
 *
 * It is prerendered (see react-router.config.ts) so that the card below is
 * the one a crawler actually sees rather than one assembled after JavaScript
 * runs, which no crawler waits for.
 */

const AWARD_PATH = "/best-paper-award";
const AWARD_URL = `${seoDefaults.SITE_URL}${AWARD_PATH}`;

const [awardedPaper] = awardedPapers;

/** "4th LIMIT Workshop @ ECCV 2026". Which edition this was belongs in the
 *  award's own text and not only on the certificate: the workshop has run
 *  four times, and a post or a CV line saying just "LIMIT Workshop" does not
 *  say which. Held in workshop.json so the fifth is a data change. */
const { edition } = workshopData.awards;

/** Written once here: the meta description, the share text and the page's own
 *  summary line are the same sentence, and it should not be possible to
 *  update one of the three and leave the others behind. */
const summary = awardedPaper ? buildAwardSummary(awardedPaper, edition) : "";

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: awardedPaper
      ? `${awardedPaper.award} — ${edition}`
      : `Award — ${edition}`,
    description: summary,
    path: AWARD_PATH,
    // The card built by scripts/award-assets/render_award_assets.py, naming
    // the paper. Without this the site's generic card is what appears under
    // every link to this page, which is the whole thing this page exists to
    // avoid.
    image: `${seoDefaults.SITE_URL}/best-paper-award-ogp.png`,
    imageAlt: awardedPaper
      ? `${awardedPaper.award}: ${awardedPaper.title}`
      : "LIMIT Workshop award",
    imageType: "image/png",
    type: "article",
    keywords: ["best paper award", "LIMIT workshop award"],
  });

/**
 * Each of these opens that network's own composer, so the post is written
 * from the author's account and they see it before it goes out. Nothing here
 * posts on anyone's behalf. The construction is in @/lib/award-share, where
 * it has tests: an encoding mistake here is invisible until an author clicks
 * the button and lands on an error.
 */
const shareTargets = buildShareTargets(summary, AWARD_URL);

const linkedInProfileUrl = awardedPaper
  ? buildLinkedInCertificationUrl({
      // The certification's name is what appears on the profile, so it
      // carries the edition; the issuer is the workshop as a body, which does
      // not gain an ordinal by running a fourth time.
      name: `${awardedPaper.award} — ${edition}`,
      organization: "LIMIT Workshop @ ECCV 2026",
      issueYear: 2026,
      issueMonth: 9,
      certUrl: AWARD_URL,
    })
  : "";

/**
 * Copying beats a share button for the cases none of the three networks
 * cover — a Slack channel, a lab mailing list, a CV. Feedback is on the
 * button itself because a toast would be a whole notification system for one
 * confirmation.
 */
function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(AWARD_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is refused in some browsers when the page is not
      // focused, and on http origins. The URL is visible in the address bar
      // and printed below, so there is nothing to recover from here.
    }
  };

  return (
    <Button variant="outline" size="lg" onClick={copy} className="gap-2">
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy link
        </>
      )}
    </Button>
  );
}

function BestPaperAward() {
  // Renders even with no award recorded, rather than 404ing: the route is
  // linked from the nav and prerendered at build time, so an empty award is a
  // page that says so, not a broken URL.
  if (!awardedPaper) {
    return (
      <main className="container mx-auto px-6 py-24 xl:max-w-6xl">
        <h1 className="font-bold">No award announced</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The workshop has not announced an award.
        </p>
      </main>
    );
  }

  const { certificate } = certificateData;

  return (
    <main className="container mx-auto px-6 py-12 space-y-16 xl:max-w-4xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        LIMIT Workshop @ ECCV 2026
      </Link>

      {/* The announcement itself, styled as the home page's award card is so
          that arriving here from a posted link and arriving by scrolling look
          like the same award. */}
      <section className="glass-strong relative overflow-hidden rounded-3xl border border-primary/30 p-8 md:p-12 shadow-lg">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Trophy className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-primary">
              {awardedPaper.award}
            </span>
          </div>

          {/* The paper's title is this page's h1. The award name above is the
              label; what was actually recognised is the paper. */}
          <div className="space-y-3">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              {awardedPaper.title}
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {awardedPaper.authors}
            </p>
          </div>

          <p className="text-base leading-relaxed text-foreground/80">
            {workshopData.awards.intro}
          </p>

          {awardedPaper.url && (
            <Button variant="outline" size="lg" asChild>
              <a
                href={awardedPaper.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                Read the paper <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Share */}
      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Share this award</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
        </div>
        <p className="text-base leading-relaxed text-foreground/80">
          Each of these opens a new post with the announcement already written.
          Nothing is posted until you send it.
        </p>
        <div className="flex flex-wrap gap-3">
          {shareTargets.map((target) => (
            <Button key={target.name} variant="outline" size="lg" asChild>
              <a
                href={target.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                {target.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ))}
          <CopyLinkButton />
        </div>
      </section>

      {/* Add to LinkedIn profile */}
      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Add it to your profile</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
        </div>
        <p className="text-base leading-relaxed text-foreground/80">
          Adds the award to the Licenses &amp; Certifications section of your
          LinkedIn profile, filled in and linked back to this page. Review it
          before saving.
        </p>
        <Button size="lg" asChild>
          <a
            href={linkedInProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            Add to LinkedIn profile
          </a>
        </Button>
      </section>

      {/* One certificate, naming all the authors, because the award is to the
          paper. Hidden if the render script has not been run, which is the
          state a freshly announced award starts in. */}
      {certificate.file && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Certificate</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <p className="text-base leading-relaxed text-foreground/80">
            The award certificate, naming all authors of the paper, as a
            print-ready A4 PDF.
          </p>
          <Button variant="outline" size="lg" asChild>
            <a
              href={certificate.file}
              download
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download certificate (PDF)
            </a>
          </Button>
        </section>
      )}

      {/* Verification — the point the certificates lean on. Anyone can typeset
          a PDF; what cannot be forged is this page, on the workshop's own
          domain, saying the same thing. Spelling the URL out means it can be
          read off a printed certificate and typed in. */}
      <section className="border-l-2 border-primary/50 pl-6 space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck
            className="h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <h2 className="text-lg font-bold">Verification</h2>
        </div>
        <p className="text-base leading-relaxed text-foreground/80">
          This page is the official record of the award, published by the
          workshop organizers at{" "}
          <span className="font-medium text-foreground">{AWARD_URL}</span>. Each
          certificate prints the same address, so a reader can check it against
          this page.
        </p>
      </section>
    </main>
  );
}

export default BestPaperAward;
