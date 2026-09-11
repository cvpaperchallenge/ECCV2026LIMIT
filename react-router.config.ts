import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  appDirectory: "src/app",
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  /**
   * Prerendered paths get a real HTML file each, with that route's own meta
   * baked into it. Everything else about the site stays a SPA.
   *
   * This exists for the social crawlers. X, LinkedIn, Slack and the rest read
   * the HTML as served and never run the JavaScript, so a route's `meta`
   * export is invisible to them: without this, every URL on the site shares
   * the one generic card built into the SPA shell. The award page is the one
   * page whose whole purpose is to be pasted somewhere else, so it is the one
   * page that has to carry its own title, description and image.
   *
   * Add a path here whenever a new route needs to be shareable or indexable
   * in its own right.
   */
  prerender: ["/best-paper-award"],
} satisfies Config;