import {
  Calendar,
  Mail,
  MapPin,
  ExternalLink,
  // FileText,
  Info,
  CalendarPlus,
} from "lucide-react";
import { SiSlack } from "react-icons/si";
import { Link, useLocation } from "react-router";
import { useEffect } from "react";

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
  CardDescription,
  CardFooter,
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
import { downloadICS, isPast, daysUntil } from "@/lib/calendar";

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
    startDate: "2026-09-08T09:00:00",
    endDate: "2026-09-08T17:00:00",
    location: {
      name: workshopData.home.eventInfo.location,
      address: "Malmö, Sweden",
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

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <main className="container mx-auto px-6 py-12 space-y-24 xl:max-w-6xl">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border px-8 py-24 md:py-32 text-center shadow-2xl">
          {/* Background Effects */}
          <div className="pointer-events-none absolute inset-0">
            <img
              src="/hero-background.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30 dark:opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
            <div className="absolute inset-0 gradient-mesh opacity-50" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-12 fade-in-up">
            {/* Conference Badge */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Held as part of
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-white px-8 py-4 shadow-lg">
                <div className="flex items-center gap-3 pl-2 pr-2">
                  <img
                    src="/eccv-navbar-logo.svg"
                    alt="ECCV 2026 | Malmö | Sept 8-13"
                    className="h-20"
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-6 max-w-4xl">
              <h1 className="gradient-text font-extrabold leading-tight">
                {workshopData.home.title}
              </h1>
              {workshopData.home.tagline && (
                <p className="text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground/90 tracking-tight">
                  {workshopData.home.tagline}
                </p>
              )}
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                {workshopData.home.subtitle}
              </p>
            </div>

            {/* Event Info */}
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8 text-base md:text-lg">
              <div className="glass flex items-center gap-3 px-6 py-3 rounded-2xl shadow-md">
                <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                <time className="font-medium" dateTime="2026-09-08T09:00">
                  {workshopData.home.eventInfo.date}
                </time>
              </div>
              <div className="glass flex items-center gap-3 px-6 py-3 rounded-2xl shadow-md">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                <address className="font-medium not-italic">
                  {workshopData.home.eventInfo.location}
                </address>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row mt-4">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link to="/#program">View Program</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Important Dates Section */}
        <section id="dates" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Important Dates</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
        </section>

        {/* Info + Latest News Section */}
        <div className="space-y-12">
          {/* Info Section */}
          <div className="glass-strong flex items-start gap-4 rounded-2xl p-8 shadow-lg card-hover">
            <Info className="h-6 w-6 shrink-0 text-primary mt-1" />
            <p className="text-base leading-relaxed">
              We are accepting paper submissions for the LIMIT Workshop at ECCV
              2026. The submission deadline is{" "}
              <span className="font-semibold text-primary">
                Monday, July 6, 2026, 23:59 AoE
              </span>
              . Please check the topics of interest below and submit your work
              via OpenReview (link coming soon).
            </p>
          </div>

          {/* Latest News Section */}
          <section id="news" className="space-y-8">
            <div className="space-y-3">
              <h2 className="font-bold">Latest News</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {workshopData.home.latestNews.map((news, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-8 shadow-md card-hover border"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{news.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {news.date}
                      </p>
                    </div>
                    <p className="text-base leading-relaxed text-foreground/80">
                      {news.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Overview Section */}
        <section id="about" className="space-y-12">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-bold">About the Workshop</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
            </div>
            <p className="text-lg leading-relaxed text-foreground/90 max-w-4xl">
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
              self-supervised, semi-supervised, weakly-supervised, and
              few-shot learning, as well as synthetic data generation and
              efficient training strategies. By fostering collaboration across
              these areas, we aim to advance computer vision research that is
              more accessible, inclusive, and applicable to diverse real-world
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

        {/* Call for Papers Section */}
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

          {/* Submit Button */}
          <div className="glass-strong rounded-2xl p-8 shadow-lg text-center space-y-4">
            <p className="text-base leading-relaxed">
              {workshopData.callForPapers.submission.description}
            </p>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              disabled
            >
              Submit via OpenReview (Coming Soon)
            </Button>
          </div>
        </section>

        {/* Program Section - hidden until program is finalized */}
        {/* <section id="program" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Workshop Program</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <div className="glass-strong flex items-start gap-4 rounded-2xl p-8 shadow-lg">
            <Info className="h-6 w-6 shrink-0 text-primary mt-1" />
            <p className="text-base leading-relaxed">
              The following workshop program is tentative and subject to change.
              The exact date, time slot, and room assignment will be confirmed
              closer to the event. Please check back for updates.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 md:p-8 border shadow-lg overflow-hidden">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-2">
                    <TableHead className="w-[150px] font-bold text-base">
                      Time
                    </TableHead>
                    <TableHead className="font-bold text-base">
                      Session
                    </TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-base">
                      Presenter
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[140px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshopData.schedule.workshopProgram.day1.schedule.map(
                    (item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-border/50 hover:bg-accent/5"
                      >
                        <TableCell className="font-semibold text-primary">
                          {item.time}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.session}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {item.presenter || ""}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {item.slides ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="hover:bg-primary/10"
                            >
                              <a
                                href={item.slides}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Slides
                              </a>
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section> */}

        {/* Invited Speakers Section - hidden until speakers are confirmed */}
        {/* <section id="speakers" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Invited Speakers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {peopleData.program.invitedSpeakers.map((speaker, index) => (
              <Card
                key={index}
                className="glass border overflow-hidden card-hover group gap-0 py-0"
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={speaker.photo}
                      alt={`Photo of ${speaker.name}`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </CardContent>
                <CardHeader className="space-y-3 pb-6 pt-6">
                  <CardTitle className="text-xl">{speaker.name}</CardTitle>
                  <CardDescription className="text-base">
                    {speaker.affiliation}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 pb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <a
                      href={speaker.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View Profile <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section> */}

        {/* Organizers */}
        <section id="organizers" className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold">Organizers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {peopleData.organizers.organizers.map((chair, index) => (
              <Card
                key={index}
                className="glass border overflow-hidden card-hover group gap-0 py-0"
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={chair.photo}
                      alt={`Photo of ${chair.name}`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </CardContent>
                <CardHeader className="space-y-2 pb-4 pt-6">
                  <CardTitle className="text-lg">{chair.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {chair.affiliation}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 pb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <a
                      href={chair.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Website <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
                    {info.icon === "SiSlack" && (
                      <SiSlack className="h-6 w-6 text-primary" />
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
                            {link.icon === "SiSlack" && (
                              <SiSlack className="h-4 w-4" />
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
