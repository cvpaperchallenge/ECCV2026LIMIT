import { createServer, type Server } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * The award URL, fetched over HTTP from the build output.
 *
 * This is the question the unit tests cannot answer: not "is the markup
 * right" but "does pasting this address into a browser or a crawler get a
 * page back". The site is a SPA, and a SPA on static hosting answers every
 * unknown path with a 404 — the award page only works because it is
 * prerendered to a file of its own. That arrangement is easy to break by
 * accident (drop the path from `prerender`, rename the route) and nothing
 * else in the build would complain: `yarn build` would still succeed, and
 * the failure would first appear as a dead link in someone's post.
 *
 * The server below implements GitHub Pages' routing rules rather than being
 * GitHub Pages, so it proves the build output has the right shape, not that
 * the deployment is healthy. Checking the deployed site is a separate step
 * after the push.
 */

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const clientDir = join(repoRoot, "build", "client");

const AWARD_PATH = "/best-paper-award";

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

/**
 * GitHub Pages, as far as this project uses it:
 *
 *   /path/    -> path/index.html
 *   /path     -> 301 to /path/, when path/ is a directory holding index.html
 *   /file.ext -> that file
 *   anything else -> 404, since the repo publishes no 404.html
 *
 * The redirect matters. og:url and the certificates both print the address
 * without a trailing slash, so that is the form that will be pasted, and it
 * has to arrive somewhere.
 */
function startServer(
  root: string,
): Promise<{ server: Server; origin: string }> {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(
      new URL(req.url ?? "/", "http://x").pathname,
    );
    const resolved = join(root, normalize(path));

    if (!resolved.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }

    if (existsSync(resolved) && statSync(resolved).isFile()) {
      res.writeHead(200, {
        "content-type": MIME[extname(resolved)] ?? "application/octet-stream",
      });
      res.end(readFileSync(resolved));
      return;
    }

    const asIndex = join(resolved, "index.html");
    if (existsSync(asIndex)) {
      if (!path.endsWith("/")) {
        res.writeHead(301, { location: `${path}/` }).end();
        return;
      }
      res.writeHead(200, { "content-type": "text/html" });
      res.end(readFileSync(asIndex));
      return;
    }

    res.writeHead(404).end();
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (typeof address === "string" || address === null) {
        throw new Error("server did not bind to a port");
      }
      resolve({ server, origin: `http://127.0.0.1:${address.port}` });
    });
  });
}

describe("the award URL, served as GitHub Pages would", () => {
  let origin: string;
  let server: Server;

  beforeAll(async () => {
    if (!existsSync(clientDir)) {
      throw new Error(
        `No build output at ${clientDir}. Run \`yarn build\` before \`yarn test\` — ` +
          "this suite checks what gets deployed, not what is in src.",
      );
    }

    ({ server, origin } = await startServer(clientDir));
  });

  afterAll(() => server?.close());

  it("is prerendered to a file of its own rather than left to the SPA", () => {
    // The thing that makes every other assertion here possible.
    expect(existsSync(join(clientDir, "best-paper-award", "index.html"))).toBe(
      true,
    );
  });

  it("answers 200 when opened directly", async () => {
    const response = await fetch(`${origin}${AWARD_PATH}/`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
  });

  it("redirects the no-trailing-slash form that gets pasted", async () => {
    const response = await fetch(`${origin}${AWARD_PATH}`, {
      redirect: "manual",
    });

    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(`${AWARD_PATH}/`);
  });

  it("arrives at the page after following that redirect", async () => {
    const response = await fetch(`${origin}${AWARD_PATH}`);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("RIPE++");
  });

  it("still 404s an unknown path, there being no SPA fallback", async () => {
    // Not a wish, just a record of how the hosting behaves: if this ever
    // starts returning 200 someone has added a 404.html and the assumptions
    // above need revisiting.
    expect((await fetch(`${origin}/no-such-page/`)).status).toBe(404);
  });
});

describe("what a crawler reads from the award URL", () => {
  let origin: string;
  let server: Server;
  let html: string;

  beforeAll(async () => {
    ({ server, origin } = await startServer(clientDir));
    html = await (await fetch(`${origin}${AWARD_PATH}/`)).text();
  });

  afterAll(() => server?.close());

  /** Fails the test when the tag is absent, rather than handing back an
   *  undefined for a later assertion to report as some unrelated mismatch. */
  const meta = (property: string): string => {
    const match = html.match(
      new RegExp(
        `<meta[^>]+(?:property|name)="${property}"[^>]*content="([^"]*)"`,
      ),
    );

    if (match === null) {
      throw new Error(`no <meta ${property}> in the served HTML`);
    }

    return match[1];
  };

  it("names the award and the paper in the title and description", () => {
    expect(meta("og:title")).toContain("Best Paper Award");
    expect(meta("og:description")).toContain("RIPE++");
  });

  it("points at the award's own card, not the site's generic one", () => {
    const image = meta("og:image");

    expect(image).toContain("best-paper-award-ogp.png");
    expect(image).not.toContain("limit-ogp.jpg");
  });

  it("gives absolute URLs, which crawlers require", () => {
    for (const property of ["og:image", "og:url"]) {
      expect(meta(property)).toMatch(/^https:\/\//);
    }
  });

  it("declares the card as a PNG and as a large summary card", () => {
    expect(meta("og:image:type")).toBe("image/png");
    expect(meta("twitter:card")).toBe("summary_large_image");
  });

  it("serves the card the tags point at", async () => {
    const path = new URL(meta("og:image")).pathname;
    const response = await fetch(`${origin}${path}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("renders the award without JavaScript, for crawlers and for no-JS", () => {
    // Prerendering is only worth anything if the body is in the HTML too.
    // A crawler that reads the tags but finds an empty page may still rank
    // the URL as thin, and a reader with JS off sees nothing.
    expect(html).toContain("RIPE++");
    expect(html).toContain("Johannes Künzel");
    expect(html).toContain("Download certificate");
  });
});

describe("what the award page links to", () => {
  let origin: string;
  let server: Server;
  let html: string;

  beforeAll(async () => {
    ({ server, origin } = await startServer(clientDir));
    html = await (await fetch(`${origin}${AWARD_PATH}/`)).text();
  });

  afterAll(() => server?.close());

  it("serves the certificate PDF it offers for download", async () => {
    const href = html.match(/href="(\/certificates\/[^"]+\.pdf)"/)?.[1];
    expect(href, "no certificate link in the page").toBeDefined();

    const response = await fetch(`${origin}${href}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/pdf");
  });

  it("offers the three share composers and the LinkedIn certification form", () => {
    expect(html).toContain("https://x.com/intent/post");
    expect(html).toContain("https://www.linkedin.com/sharing/share-offsite/");
    expect(html).toContain("https://bsky.app/intent/compose");
    expect(html).toContain("startTask=CERTIFICATION_NAME");
  });

  it("links back to the workshop", () => {
    expect(html).toMatch(/href="\/"/);
  });
});
