import type { MetaDescriptor } from "react-router";

const SITE_URL = "https://cvpr2026-bigmac-workshop.limitlab.xyz";
const DEFAULT_IMAGE = `${SITE_URL}/bigmac-ogp.jpg`;
const DEFAULT_IMAGE_ALT =
  "BigMAC Workshop at CVPR 2026 wordmark on a dark gradient background";
const SITE_NAME =
  "BigMAC: Big Model Adaptation for Computer Vision @ CVPR 2026";
const DEFAULT_DESCRIPTION =
  "Official site for the CVPR 2026 Workshop on Big Model Adaptation for Computer Vision.";
const DEFAULT_KEYWORDS = [
  "BigMAC Workshop",
  "CVPR 2026",
  "Big Model Adaptation",
  "Foundation Models",
  "Big Models",
  "Adaptation",
  "LIMIT Lab",
];

type SeoConfig = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: string;
  keywords?: string[];
};

const normalizePath = (path?: string) => {
  if (!path || path === "/") {
    return "";
  }

  return path.startsWith("/") ? path : `/${path}`;
};

export function buildMeta(config: SeoConfig = {}): MetaDescriptor[] {
  const {
    title = SITE_NAME,
    description = DEFAULT_DESCRIPTION,
    path,
    image = DEFAULT_IMAGE,
    imageAlt = DEFAULT_IMAGE_ALT,
    type = "website",
    keywords = [],
  } = config;

  const canonicalPath = normalizePath(path);
  const url = `${SITE_URL}${canonicalPath}`;
  const keywordSet = new Set([
    ...DEFAULT_KEYWORDS,
    ...keywords.filter((keyword) => keyword.trim().length > 0),
  ]);
  const keywordContent = Array.from(keywordSet).join(", ");

  const descriptors: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    ...(keywordContent ? [{ name: "keywords", content: keywordContent }] : []),
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
    { tagName: "link", rel: "canonical", href: url },
  ];

  return descriptors;
}

export const seoDefaults = {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_ALT,
  DEFAULT_KEYWORDS,
};
