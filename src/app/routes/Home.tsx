import {
  Calendar,
  Mail,
  MapPin,
  ExternalLink,
  FileText,
  Info,
  // CalendarPlus,
  Slack,
  Building2,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useEffect } from "react";
import { NewsCarousel } from "../../components/news-carousel";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import workshopData from "../../data/workshop.json";
import peopleData from "../../data/people.json";
import type { Route } from "./+types/Home";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { buildMeta } from "@/lib/seo";
import { generateWorkshopStructuredData } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
// import { downloadICS, isPast, daysUntil } from "@/lib/calendar";

export const meta: Route.MetaFunction = () =>
  buildMeta({
    title:
      "LIMIT Workshop @ ECCV 2026 | Representation Learning with Very Limited Resources",
    description:
      "LIMIT Workshop at ECCV 2026 brings together researchers working on representation learning with scarce data, labels, modalities, and computing resources. Join us in September 2026 in Malmö, Sweden.",
    path: "/",
    keywords: [
      "eccv workshop 2026",
      "limited resources",
      "representation learning",
      "few-shot learning",
    ],
  });

/**
 * The poster session is one run of numbered boards in the Exhibit Hall, shared
 * by the accepted papers, the invited posters and the workshop's sponsors.
 * Only the range and the sponsor positions are derived here, for the prose
 * above the lists; each board itself stays with what it belongs to, papers in
 * people.json and sponsors alongside their logo in workshop.json, so neither
 * side's data is copied into the other.
 *
 * The papers take their boards in the order this page lists them — the four
 * orals, then the posters, then the invited posters — so reading down the two
 * lists is reading down the row in the hall. The sponsors are spaced through
 * that run rather than grouped at one end: on every fifth board no one can
 * walk the row without passing one, and no sponsor is first, last or next to
 * another.
 *
 * The numbers are stored per paper rather than derived from position. Derived
 * numbering would look tidier, but a paper inserted into either list would
 * then silently renumber everyone below it after the numbers had already been
 * sent out. Fixing them means a later insertion breaks the run rather than
 * someone's board.
 */
const sponsorBoards = workshopData.sponsors.sponsors
  .filter((sponsor) => sponsor.board > 0)
  .map((sponsor) => sponsor.board)
  .sort((a, b) => a - b);

const allBoards = [
  ...peopleData.program.acceptedPapers.map((paper) => paper.board),
  ...peopleData.program.invitedPosters.map((poster) => poster.board),
  ...sponsorBoards,
].sort((a, b) => a - b);

const firstBoard = allBoards[0];
const lastBoard = allBoards[allBoards.length - 1];

/** "5, 10 and 15" — a bare comma list of numbers would read as a range. */
const sponsorBoardList =
  sponsorBoards.length > 1
    ? `${sponsorBoards.slice(0, -1).join(", ")} and ${
        sponsorBoards[sponsorBoards.length - 1]
      }`
    : sponsorBoards.join("");

/**
 * The board a presentation is hung on, in the left column the Program schedule
 * gives its time chip, so a presenter hunting for their own board reads down
 * one edge instead of through sixteen titles. Bigger and bolder than the time
 * chip because it is the one thing on the row that has to be acted on, and
 * tabular-nums keeps the digits aligned in that column.
 */
function BoardNumber({
  board,
  className,
}: {
  board: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 whitespace-nowrap rounded-lg bg-primary/10 px-3 py-2 text-primary",
        className,
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
        Board
      </span>
      <span className="text-lg font-bold tabular-nums leading-none">
        {board}
      </span>
    </span>
  );
}

/** Shared by the two lists, so their board columns cannot drift apart. */
const boardColumn = "justify-self-start sm:w-full sm:justify-center";
const boardRow =
  "grid gap-x-4 gap-y-2 px-2 py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-x-6 sm:px-3";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const element = document.querySelector(location.hash);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [location.hash]);

  // Generate structured data for SEO
  const structuredData = generateWorkshopStructuredData({
    name: workshopData.home.title,
    description: workshopData.home.overview.mission,
    startDate: "2026-09-08T08:30:00",
    endDate: "2026-09-08T13:00:00",
    location: {
      name: workshopData.home.eventInfo.venue,
      address: workshopData.home.eventInfo.location,
    },
    organizer: {
      name: "LIMIT Workshop Organizing Committee",
      url: "https://eccv2026-limit-workshop.limitlab.xyz",
    },
    image: "https://eccv2026-limit-workshop.limitlab.xyz/limit-ogp.jpg",
    url: "https://eccv2026-limit-workshop.limitlab.xyz",
    eventAttendanceMode: "OfflineEventAttendanceMode",
    eventStatus: "EventScheduled",
  });

  const { acceptedPapers, invitedPosters } = peopleData.program;
  const oralCount = acceptedPapers.filter(
    (paper) => paper.type === "Oral",
  ).length;

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <main className="container mx-auto px-6 py-12 space-y-24 xl:max-w-6xl">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border px-6 py-14 md:px-8 md:py-24 lg:py-32 text-center shadow-2xl">
          {/* Background Effects */}
          <div className="pointer-events-none absolute inset-0">
            <img
              src="/cover.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50 dark:opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
            <div className="absolute inset-0 gradient-mesh opacity-50" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 md:gap-10 lg:gap-12 fade-in-up">
            {/* Conference Badge */}
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Held as part of
              </span>
              <div className="flex flex-wrap items-center justify-center rounded-xl md:rounded-2xl bg-white px-5 py-2.5 md:px-8 md:py-4 shadow-lg">
                <img
                  src="/eccv-navbar-logo.svg"
                  alt="ECCV 2026 | Malmö | Sept 8-13"
                  className="h-12 sm:h-14 md:h-20"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3 md:space-y-6 max-w-4xl">
              <h1 className="gradient-text font-extrabold leading-tight text-3xl md:text-5xl lg:text-6xl">
                {workshopData.home.title}
              </h1>
              {workshopData.home.tagline && (
                <p className="text-sm md:text-xl lg:text-2xl font-medium text-muted-foreground/90 tracking-tight">
                  {workshopData.home.tagline}
                </p>
              )}
              <p className="text-sm md:text-lg text-muted-foreground font-medium">
                {workshopData.home.subtitle}
              </p>
            </div>

            {/* Event Info — each box carries a headline and a subordinate line
                (day over start time, venue over city). Naming the room makes
                these strings long enough to collide on a phone, so the pair
                stacks below `sm` rather than sharing one row. */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 text-sm md:text-lg w-full max-w-2xl">
              <div className="glass flex flex-1 items-center gap-3 md:gap-4 px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-md">
                <Calendar
                  className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0"
                  aria-hidden="true"
                />
                <div className="flex flex-col leading-tight text-left min-w-0">
                  <time className="font-medium truncate" dateTime="2026-09-08">
                    {workshopData.home.eventInfo.date}
                  </time>
                  <span className="text-xs md:text-sm font-normal text-muted-foreground truncate">
                    {workshopData.home.eventInfo.time}
                  </span>
                </div>
              </div>
              <div className="glass flex flex-1 items-center gap-3 md:gap-4 px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-md">
                <MapPin
                  className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0"
                  aria-hidden="true"
                />
                <address className="not-italic flex flex-col leading-tight text-left min-w-0">
                  <span className="font-medium truncate">
                    {workshopData.home.eventInfo.venue}
                  </span>
                  <span className="text-xs md:text-sm font-normal text-muted-foreground truncate">
                    {workshopData.home.eventInfo.location}
                  </span>
                </address>
              </div>
            </div>

            {/* CTA Buttons — the submission CTA was removed once the deadline
                passed; the program link takes its place as the next milestone. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                className="text-sm md:text-base px-6 py-4 md:px-8 md:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link to="/#program">View Program</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Important Dates Section - hidden now that the submission, review
            and camera-ready milestones have all passed; three of the four
            cards were struck through. The `home.importantDates` data stays in
            workshop.json because the sticky DeadlineBanner in layout.tsx reads
            it to count down to the workshop itself. */}
        {/* <section id="dates" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Important Dates</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workshopData.home.importantDates.map((item, index) => {
              const past = isPast(item.date);
              const days = daysUntil(item.date);
              return (
                <div
                  key={index}
                  className={`glass rounded-xl p-6 shadow-md border card-hover group ${
                    past ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`h-4 w-4 shrink-0 ${
                            past ? "text-muted-foreground" : "text-primary"
                          }`}
                        />
                        <p
                          className={`text-sm font-semibold ${
                            past
                              ? "text-muted-foreground line-through"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.date}
                        </p>
                      </div>
                      <h3
                        className={`text-base font-semibold leading-tight ${
                          past ? "text-muted-foreground" : ""
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!past && days !== null && (
                        <p className="text-xs font-semibold text-primary">
                          {days === 0
                            ? "Today!"
                            : days === 1
                              ? "Tomorrow!"
                              : `in ${days} days`}
                        </p>
                      )}
                      {past && (
                        <p className="text-xs font-semibold text-muted-foreground">
                          Ended
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => downloadICS(item.title, item.date)}
                      className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Add to calendar"
                      title="Add to calendar"
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section> */}

        {/* Latest News Section */}
        <section id="news" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Latest News</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <NewsCarousel items={workshopData.home.latestNews} />
        </section>

        {/* Overview Section */}
        <section id="about" className="space-y-12">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-bold">About the Workshop</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
            </div>
            <p className="text-lg leading-relaxed text-foreground/90">
              {workshopData.home.overview.mission}
            </p>
          </div>

          {/* Broader impact */}
          <div className="glass rounded-2xl p-10 space-y-4 border shadow-lg">
            <h3 className="text-2xl font-bold">Broader Impact</h3>
            <p className="text-base leading-relaxed text-foreground/80">
              Deep learning has achieved remarkable success across many domains,
              but its reliance on massive datasets, abundant labels, and
              significant computing resources limits accessibility and
              applicability. Many real-world scenarios involve scarce data,
              incomplete modalities, noisy or missing labels, and constrained
              computational budgets. This workshop aims to bridge this gap by
              exploring how representation learning can be made effective under
              such limited-resource conditions. We bring together researchers
              from academia and industry to discuss novel approaches including
              self-supervised, semi-supervised, weakly-supervised, and few-shot
              learning, as well as synthetic data generation and efficient
              training strategies. By fostering collaboration across these
              areas, we aim to advance computer vision research that is more
              accessible, inclusive, and applicable to diverse real-world
              problems.
            </p>
          </div>

          {/* Topics of Interest */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Topics of Interest</h3>
            <p className="text-base text-muted-foreground">
              The workshop focuses on the following topics:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {workshopData.callForPapers.topics.core.map((topic, index) => (
                <div
                  key={index}
                  className="glass flex items-start gap-4 rounded-xl p-6 border card-hover"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <p className="text-base leading-relaxed pt-1">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Program Section */}
        <section id="program" className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-bold">Workshop Program</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Tentative
              </span>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>

          {/* Date and venue are omitted here on purpose — the hero already
              states both prominently. */}
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="leading-relaxed">
              This program is tentative and subject to change. All times are
              local to Malmö. The talks take place in Malmömässan C1; the poster
              session is in the Malmömässan Exhibit Hall.
            </span>
          </p>

          {/* One card for the whole schedule, hairline-divided — a timetable is
              a single continuous list, not ten independent objects, so the rows
              carry no border, blur or hover of their own. Within a row the
              session type is a kicker above the presenter: uppercase tracking
              makes it scannable without competing for weight, and it leaves the
              line below free for the talk title once those are announced. */}
          <div className="glass rounded-2xl border shadow-lg">
            <ol className="divide-y divide-border/50 p-2 sm:p-4">
              {workshopData.schedule.workshopProgram.day1.schedule.map(
                (item, index) => (
                  <li
                    key={index}
                    className="flex flex-col gap-1 px-2 py-4 sm:flex-row sm:items-baseline sm:gap-6 sm:px-3"
                  >
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-primary sm:w-28">
                      {item.time}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      {/* A row's headline is its presenter, or its paper title
                          where no presenter is named (the orals), so that every
                          content row reads as kicker-then-content rather than
                          burying the substance in the subordinate line. */}
                      {item.presenter || item.title ? (
                        <>
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {item.session}
                          </p>
                          <p className="font-semibold leading-snug">
                            {item.presenter || item.title}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium leading-snug">
                            {item.session}
                          </p>
                          {/* A room goes on this line when it differs from the
                              one in the note above the schedule — the poster
                              boards are not in C1, and a reader planning their
                              morning should see that on the row itself rather
                              than have to hunt for it. */}
                          {item.location && (
                            <p className="flex items-center gap-1.5 text-sm leading-snug text-muted-foreground">
                              <MapPin
                                className="h-3.5 w-3.5 shrink-0 text-primary"
                                aria-hidden="true"
                              />
                              {item.location}
                            </p>
                          )}
                        </>
                      )}
                      {item.presenter && item.title && (
                        <p className="text-sm italic leading-snug text-muted-foreground">
                          {item.title}
                        </p>
                      )}
                      {item.slides && (
                        <a
                          href={item.slides}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 pt-0.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Slides
                        </a>
                      )}
                    </div>
                  </li>
                ),
              )}
            </ol>
          </div>
        </section>

        {/* Invited Speakers Section */}
        <section id="speakers" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Invited Speakers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          {/* A speaker with an empty `photo` / `website` in people.json is an
              unannounced slot: the portrait becomes a placeholder and the
              profile link is dropped, so a TBA entry needs no code change. */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {peopleData.program.invitedSpeakers.map((speaker, index) => (
              <Card
                key={index}
                className="glass border overflow-hidden card-hover group gap-0 py-0 flex flex-col"
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {speaker.photo ? (
                      <img
                        src={speaker.photo}
                        alt={`Photo of ${speaker.name}`}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UserRound className="h-8 w-8" strokeWidth={1.5} />
                        <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest">
                          Coming soon
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardHeader className="space-y-1 sm:space-y-3 p-3 sm:p-6 flex-1">
                  <CardTitle className="text-sm sm:text-xl">
                    {speaker.name}
                  </CardTitle>
                  {speaker.affiliation && (
                    <p className="text-xs sm:text-base text-muted-foreground">
                      {speaker.affiliation}
                    </p>
                  )}
                </CardHeader>
                {speaker.website && (
                  <div className="px-3 pb-3 sm:px-6 sm:pb-6 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      asChild
                    >
                      <a
                        href={speaker.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 sm:gap-2"
                      >
                        Profile{" "}
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Papers and Posters — everything the workshop presents, under one
            heading, with the poster-session logistics at its head.

            The two lists are subsections of this rather than sections beside
            it. They were peers of a "Poster Session" heading before, which
            named a container and then sat next to its own contents; a heading
            for the practical notes alone would have had the same problem in
            reverse. What actually contains both lists is "what is presented",
            so that is what the heading says, and the notes are the first thing
            under it because a presenter needs the hall and the poster size
            before they need to find their own row.

            Only the h2 keeps the gradient rule beneath it. That rule is what
            marks a top-level section on this page, so leaving it off the two
            subsection headings is what makes the nesting legible at a glance.

            The boards are numbered beside each paper in the lists rather than
            repeated in a run of their own: the papers take their boards in the
            order these lists give them, so reading down the two lists is
            reading down the row in the hall, and a second copy of sixteen
            titles would be one more place for a title to go stale. */}
        <section id="papers" className="space-y-10">
          <div className="space-y-3">
            <h2 className="font-bold">Papers and Posters</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>

          <div className="space-y-6">
            {/* Deliberately short: the counts are in each list's own line
                below, and the hall is in the Location note directly under this
                as well as on the schedule row, so this says only what is said
                nowhere else — the range, and the three boards the sponsors
                take, which is what accounts for the gaps in the numbering.

                The sponsor boards are an exception to the run rather than
                entries in it. Those three do not appear in either list below
                (the sponsors have their own section further down), so naming
                them as boards the papers do not take is the accurate way to
                put it. */}
            <p className="text-lg leading-relaxed text-foreground/90">
              The papers and posters below take boards {firstBoard}–{lastBoard}{" "}
              at the poster session, apart from {sponsorBoardList}, which the
              workshop&apos;s sponsors take.
            </p>

            {/* Left-bordered callout, the shape this page uses for practical
                points that must not be missed. The points are ordered by when
                someone has to act on them: the size leads because it is the
                only one with a lead time, it has to be right before anything
                is printed, and the 140x100 landscape format is the opposite of
                the portrait most people default to. */}
            <div className="border-l-2 border-primary/50 pl-6 space-y-4">
              <div className="flex items-center gap-3">
                <Info
                  className="h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <h3 className="text-lg font-bold">
                  {
                    workshopData.schedule.presenterGuidelines.posterPresentation
                      .title
                  }
                </h3>
              </div>
              <p className="text-base leading-relaxed text-foreground/80">
                {
                  workshopData.schedule.presenterGuidelines.posterPresentation
                    .intro
                }
              </p>
              <ul className="space-y-2.5">
                {workshopData.schedule.presenterGuidelines.posterPresentation.points.map(
                  (point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <p className="text-base leading-relaxed">
                        <span className="font-semibold text-foreground">
                          {point.label}
                        </span>{" "}
                        <span className="text-foreground/80">{point.text}</span>
                      </p>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* One card with hairline-divided rows, the same treatment as the
              Program schedule, since both are continuous lists of the
              workshop's own content. The orals lead the list in the order they
              are presented and every row states its format, so the four talks
              can be picked out without consulting the schedule. */}
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Accepted Papers</h3>
              {/* Every accepted paper is on a board, the talks included, so
                  the split this sentence draws is between the papers that also
                  get the stage and the rest — not between talks and posters,
                  which would now read as though the orals were not in the
                  hall. */}
              <p className="text-base leading-relaxed text-foreground/80">
                {acceptedPapers.length} papers were accepted to the workshop,{" "}
                {oralCount} of them also presented as talks.
              </p>
            </div>
            <div className="glass rounded-2xl border shadow-lg">
              <ol className="divide-y divide-border/50 p-2 sm:p-4">
                {acceptedPapers.map((paper, index) => (
                  <li key={index} className={boardRow}>
                    <BoardNumber board={paper.board} className={boardColumn} />
                    {/* Title, authors and format stay together in the
                        right-hand column, so the format badge keeps sitting at
                        the end of the title rather than drifting away from
                        it. */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-base font-semibold leading-snug">
                          {paper.title}
                        </h4>
                        <p className="text-sm leading-snug text-muted-foreground">
                          {paper.authors}
                        </p>
                      </div>
                      {/* The talks are the exception in a list that is mostly
                          posters, so only they take the accent colour. */}
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest sm:text-xs ${
                          paper.type === "Oral"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {paper.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Kept as a list of its own rather than merged into the one above
              with a third badge: these did not come through the workshop's
              review process, and a heading says so more plainly than a label
              inside a list called "Accepted Papers" could. */}
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Invited Posters</h3>
              <p className="text-base leading-relaxed text-foreground/80">
                {invitedPosters.length} further posters were invited to the
                workshop rather than submitted for review.
              </p>
            </div>
            <div className="glass rounded-2xl border shadow-lg">
              <ol className="divide-y divide-border/50 p-2 sm:p-4">
                {invitedPosters.map((poster, index) => (
                  <li key={index} className={boardRow}>
                    {/* Outside the link: the board is where the poster hangs
                        in the hall, not part of what arXiv is being asked
                        for. */}
                    <BoardNumber board={poster.board} className={boardColumn} />
                    {/* The rest of the row is the target, so the hover
                        feedback can be the row itself: the title takes the
                        accent colour and the arXiv chip fills in. The chip
                        sits where the accepted papers carry their format
                        badge, which keeps the two lists aligned even though
                        only this one links out. The negative margins give that
                        hover box some room without moving the first line off
                        the chip's baseline. */}
                    <a
                      href={poster.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group -mx-2 -my-2 flex items-start justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none sm:gap-4"
                    >
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-base font-semibold leading-snug transition-colors group-hover:text-primary group-focus-visible:text-primary">
                          {poster.title}
                        </h4>
                        <p className="text-sm leading-snug text-muted-foreground">
                          {poster.authors}
                        </p>
                      </div>
                      {/* Not uppercased like the format badges: arXiv is a
                          proper noun and "ARXIV" would misspell it. */}
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary group-focus-visible:bg-primary/10 group-focus-visible:text-primary sm:text-xs">
                        arXiv
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Organizers */}
        <section id="organizers" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Organizers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {peopleData.organizers.organizers.map((chair, index) => (
              <a
                key={index}
                href={chair.website}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center text-center gap-3"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-border/50 group-hover:ring-primary/60 transition-all duration-300">
                  <img
                    src={chair.photo}
                    alt={`Photo of ${chair.name}`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors duration-300">
                    {chair.name}
                  </p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {chair.affiliation}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Reviewers Section - sits with Organizers and Sponsors as part of the
            acknowledgement cluster, and pairs with the review process described
            under Call for Papers. Deliberately quieter than Organizers: no
            portraits, no links, smaller type. */}
        <section id="reviewers" className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-bold">Reviewers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <p className="text-lg leading-relaxed text-foreground/90">
            We thank the {peopleData.reviewers.length} reviewers below for the
            time and expertise they gave to the review process.
          </p>
          {/* CSS multi-column rather than a grid: the list is alphabetical, and
              columns flow top-to-bottom before wrapping, which keeps that order
              readable. A grid would run A, B, C across each row instead. */}
          <ul className="columns-1 gap-x-10 sm:columns-2 lg:columns-3">
            {peopleData.reviewers.map((reviewer, index) => (
              <li key={index} className="mb-3 break-inside-avoid">
                <p className="text-sm font-medium leading-snug">
                  {reviewer.name}
                </p>
                {reviewer.affiliation && (
                  <p className="text-xs leading-snug text-muted-foreground">
                    {reviewer.affiliation}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Sponsors Section */}
        <section id="sponsors" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">{workshopData.sponsors.title}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>

          <p className="text-lg leading-relaxed text-foreground/90">
            {workshopData.sponsors.intro}
          </p>

          {/* Logo cards — background is fixed to white in both themes so that
              sponsor logo usage guidelines are respected. */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workshopData.sponsors.sponsors.map((sponsor, index) => {
              const card = (
                <>
                  {/* Clear space is per sponsor (`padding` in workshop.json,
                      in px) because the logos differ wildly in aspect ratio —
                      a 9:1 wordmark needs a tighter inset than a square mark to
                      read at a comparable size. Inline style rather than a
                      Tailwind class: the value comes from data, and Tailwind
                      only generates classes it can find in the source. */}
                  <div
                    className="card-hover mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center rounded-2xl bg-white ring-1 ring-black/5 shadow-sm dark:shadow-lg dark:shadow-black/30"
                    style={{ padding: sponsor.padding }}
                  >
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={`${sponsor.name} logo`}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Building2 className="h-8 w-8" strokeWidth={1.5} />
                        <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest">
                          Logo coming soon
                        </span>
                      </div>
                    )}
                  </div>
                  {sponsor.name && (
                    <p className="mt-4 text-center text-sm sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {sponsor.name}
                    </p>
                  )}
                  {/* Sponsors present from a board of their own, so their
                      number belongs on the card next to their name — the same
                      chip the two poster lists use, since the run of boards is
                      one map of the hall and one board is as findable as the
                      next. */}
                  {sponsor.board > 0 && (
                    <p className="mt-3 flex justify-center">
                      <BoardNumber board={sponsor.board} />
                    </p>
                  )}
                </>
              );

              return sponsor.url ? (
                <a
                  key={index}
                  href={sponsor.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${sponsor.name} — external site`}
                  className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  {card}
                </a>
              ) : (
                <div key={index}>{card}</div>
              );
            })}
          </div>
        </section>

        {/* Call for Papers Section - kept as an archival record now that the
            call has closed, so it sits near the foot of the page. The review
            process and publication details below are what give the Reviewers
            section its context, which is why this is retained rather than
            dropped. */}
        <section id="cfp" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Call for Papers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>

          {/* Submission Guidelines */}
          <div className="glass rounded-2xl p-8 md:p-10 border shadow-lg space-y-6">
            <h3 className="text-xl font-bold">Submission Guidelines</h3>
            <ul className="space-y-3">
              {workshopData.callForPapers.paperFormat.submissionGuidelines.map(
                (guideline, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-base leading-relaxed">{guideline}</p>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Review & Publication */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-8 border shadow-md space-y-3">
              <h3 className="text-lg font-bold">Review Process</h3>
              <p className="text-base leading-relaxed text-foreground/80">
                {workshopData.callForPapers.paperFormat.reviewProcess}
              </p>
            </div>
            <div className="glass rounded-2xl p-8 border shadow-md space-y-3">
              <h3 className="text-lg font-bold">Publication</h3>
              <p className="text-base leading-relaxed text-foreground/80">
                {workshopData.callForPapers.paperFormat.publication}
              </p>
            </div>
          </div>

          {/* Submission status — the call is closed, so the OpenReview link is
              kept as a reference to the venue rather than as a submit CTA. */}
          <div className="glass-strong rounded-2xl p-8 shadow-lg text-center space-y-4">
            <p className="text-base leading-relaxed">
              {workshopData.callForPapers.submission.description}
            </p>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 rounded-xl"
              asChild
            >
              <a
                href={workshopData.callForPapers.submission.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                View on OpenReview <ExternalLink className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        {/* Contact Information */}
        <section id="contact" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Contact Information</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {workshopData.contact.contactInfo.map((info, index) => (
              <Card key={index} className="glass border card-hover">
                <CardHeader className="space-y-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    {info.icon === "Mail" && (
                      <Mail className="h-6 w-6 text-primary" />
                    )}
                    {info.icon === "MapPin" && (
                      <MapPin className="h-6 w-6 text-primary" />
                    )}
                    {info.icon === "Slack" && (
                      <Slack className="h-6 w-6 text-primary" />
                    )}
                    {info.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.description}
                  </p>
                  {info.value && (
                    <p className="font-semibold text-base">
                      {info.type === "Email" ? (
                        <a
                          href={`mailto:${info.value}`}
                          className="text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4"
                        >
                          {info.value}
                        </a>
                      ) : (
                        info.value.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < info.value.split("\n").length - 1 && <br />}
                          </span>
                        ))
                      )}
                    </p>
                  )}
                  {info.socialLinks && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {info.socialLinks.map((link, linkIndex) => (
                        <Button
                          key={linkIndex}
                          variant="outline"
                          size="sm"
                          className="flex gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                          asChild
                        >
                          <a href={link.url} target="_blank" rel="noreferrer">
                            {link.icon === "Slack" && (
                              <Slack className="h-4 w-4" />
                            )}
                            {link.name}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
