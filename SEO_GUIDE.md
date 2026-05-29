# SEO Configuration Guide

This guide will help you optimize your workshop website for search engines to maximize visibility and discoverability.

## Table of Contents

1. [Essential SEO Settings](#essential-seo-settings)
2. [Structured Data Configuration](#structured-data-configuration)
3. [Meta Tags & Social Media](#meta-tags--social-media)
4. [Sitemap & Robots.txt](#sitemap--robotstxt)
5. [Image Optimization](#image-optimization)
6. [Testing & Validation](#testing--validation)

---

## Essential SEO Settings

### 1. Update Site Information (`src/lib/seo.ts`)

**IMPORTANT**: Update these values for your workshop:

```typescript
const SITE_URL = "https://your-workshop-domain.com";
const SITE_NAME = "Your Workshop Name @ Conference Year";
const DEFAULT_DESCRIPTION = "Brief description of your workshop (150-160 characters)";
const DEFAULT_KEYWORDS = [
  "Workshop Name",
  "Conference Name Year",
  "Main Topic 1",
  "Main Topic 2",
  // Add 5-10 relevant keywords
];
```

**Best Practices**:
- Title: Include workshop name + conference + year (50-60 characters)
- Description: Compelling summary with key topics (150-160 characters)
- Keywords: 5-10 most relevant terms (avoid keyword stuffing)

### 2. Update Page Title (`src/app/routes/Home.tsx`)

```typescript
export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: "Your Workshop @ Conference Year | Main Topic",
    description: "Join us at Conference Year for discussions on [main topics]. Date, location, and speakers.",
    keywords: ["workshop specific", "topic keywords"],
  });
```

---

## Structured Data Configuration

Structured data helps Google display rich results (date, location, etc.) in search results.

### Update Workshop Event Data (`src/app/routes/Home.tsx`)

**Line ~60-80**: Update the `generateWorkshopStructuredData` call:

```typescript
const structuredData = generateWorkshopStructuredData({
  name: "Your Workshop Full Name",
  description: "Detailed workshop description (200-300 characters)",
  
  // IMPORTANT: Use ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
  startDate: "2026-06-04T09:00:00",  // Update with actual start time
  endDate: "2026-06-04T17:00:00",    // Update with actual end time
  
  location: {
    name: "Venue Name - Room Number",
    address: "Full Address, City, State, Country", // Add full address
  },
  
  organizer: {
    name: "Your Organization/Committee Name",
    url: "https://your-organization.com", // Optional: organization website
  },
  
  image: "https://your-workshop-domain.com/ogp-image.jpg", // Must be full URL
  url: "https://your-workshop-domain.com",
  
  // Update if online/hybrid
  eventAttendanceMode: "OfflineEventAttendanceMode", 
  // Options: "OfflineEventAttendanceMode", "OnlineEventAttendanceMode", "MixedEventAttendanceMode"
  
  eventStatus: "EventScheduled",
  // Options: "EventScheduled", "EventCancelled", "EventPostponed", "EventRescheduled"
});
```

### Date & Time Format

**Critical**: Always use ISO 8601 format for dates:

- ✅ Correct: `"2026-06-04T09:00:00"`
- ❌ Wrong: `"June 4, 2026, 9:00 AM"`

Include timezone if needed:
- With timezone: `"2026-06-04T09:00:00-07:00"` (PDT)
- UTC: `"2026-06-04T16:00:00Z"`

### Event Attendance Mode

Choose the appropriate mode:

| Mode | Description | When to Use |
|------|-------------|-------------|
| `OfflineEventAttendanceMode` | In-person only | Traditional conference workshop |
| `OnlineEventAttendanceMode` | Virtual only | Online-only event |
| `MixedEventAttendanceMode` | Hybrid | Both in-person and virtual attendance |

---

## Meta Tags & Social Media

### Open Graph (OGP) Images

**File**: `public/your-workshop-ogp.jpg`

**Requirements**:
- Dimensions: 1200 x 630 pixels (optimal for social media)
- Format: JPG or PNG
- Size: < 1MB
- Content: Workshop name, date, conference logo

**Update in `src/lib/seo.ts`**:
```typescript
const DEFAULT_IMAGE = `${SITE_URL}/your-workshop-ogp.jpg`;
const DEFAULT_IMAGE_ALT = "Descriptive alt text for your OGP image";
```

### Favicon

**File**: `public/favicon.ico`

Replace with your workshop/organization logo:
- Size: 32x32 or 16x16 pixels
- Format: ICO, PNG, or SVG

---

## Sitemap & Robots.txt

### Update Sitemap (`public/sitemap.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-workshop-domain.com/</loc>
    <lastmod>2026-01-15</lastmod>  <!-- Update when site changes -->
    <changefreq>weekly</changefreq> <!-- or "daily" before workshop -->
    <priority>1.0</priority>
  </url>
</urlset>
```

**Update**:
- `<loc>`: Your full workshop URL
- `<lastmod>`: Last significant update date (YYYY-MM-DD)
- `<changefreq>`: How often content changes

### Update robots.txt (`public/robots.txt`)

```
User-agent: *
Allow: /

Sitemap: https://your-workshop-domain.com/sitemap.xml
```

**Update**:
- Sitemap URL to match your domain

---

## Image Optimization

### Speaker/Organizer Photos

**Location**: `public/organizers/`, `public/program/`

**Best Practices**:
1. **Naming**: Use descriptive names
   - ✅ `john-doe.jpg`
   - ❌ `IMG_1234.jpg`

2. **Optimization**: Compress before uploading
   - Recommended: Use [TinyPNG](https://tinypng.com/) or similar
   - Target: < 200KB per image

3. **Dimensions**:
   - Organizers: 302 x 302 pixels
   - Speakers: 512 x 512 pixels

4. **Alt Text**: Already handled automatically
   - Uses: `Photo of [Speaker Name], [Affiliation]`

### Cover/Background Images

**Location**: `public/`

- `your-workshop-cover.jpg`: Hero section background (1920 x 1080)
- `your-workshop-ogp.jpg`: Social media preview (1200 x 630)

**Update references in**:
- `src/app/routes/Home.tsx`: Update image src in Hero section
- `src/lib/seo.ts`: Update DEFAULT_IMAGE

---

## Testing & Validation

### Before Launch Checklist

- [ ] All URLs updated (SITE_URL, sitemap, robots.txt)
- [ ] Structured data configured with correct dates
- [ ] OGP image uploaded and referenced
- [ ] Meta descriptions are compelling and accurate
- [ ] Keywords reflect workshop topics

### Testing Tools

#### 1. **Google Rich Results Test**
URL: https://search.google.com/test/rich-results

**How to test**:
1. Enter your workshop URL
2. Check for "Event" structured data
3. Verify date, location, and image appear correctly

#### 2. **Schema.org Validator**
URL: https://validator.schema.org/

**How to test**:
1. Enter your workshop URL
2. Look for "Event" type
3. Check for warnings or errors

#### 3. **Facebook Sharing Debugger**
URL: https://developers.facebook.com/tools/debug/

**How to test**:
1. Enter your workshop URL
2. Click "Scrape Again" to refresh
3. Check preview image and text

#### 4. **Twitter Card Validator**
URL: https://cards-dev.twitter.com/validator

**How to test**:
1. Enter your workshop URL
2. Check card preview
3. Verify image and description

#### 5. **Google Search Console**
URL: https://search.google.com/search-console

**After launch**:
1. Add and verify your property
2. Submit sitemap
3. Monitor indexing status

---

## Common Issues & Solutions

### Issue: Rich results not showing

**Solutions**:
1. Verify structured data with Google Rich Results Test
2. Ensure dates are in ISO 8601 format
3. Check that all required fields are filled
4. Wait 1-2 weeks after Google crawls your site

### Issue: Wrong image in social media previews

**Solutions**:
1. Clear social media cache (Facebook debugger, Twitter validator)
2. Verify image URL is absolute (includes https://)
3. Check image dimensions (1200x630 for OGP)
4. Ensure image is < 1MB

### Issue: Duplicate meta tags

**Solutions**:
- Only use `buildMeta()` helper, don't add manual meta tags
- Check that you're not overriding meta in multiple places

---

## Quick Reference: File Checklist

When setting up your workshop, update these files:

| File | What to Update |
|------|---------------|
| `src/lib/seo.ts` | SITE_URL, SITE_NAME, description, keywords, image |
| `src/app/routes/Home.tsx` | Page title/meta, structured data (dates, location) |
| `src/data/workshop.json` | All workshop content |
| `public/sitemap.xml` | URL, lastmod date |
| `public/robots.txt` | Sitemap URL |
| `public/[workshop]-ogp.jpg` | Social media preview image |
| `public/favicon.ico` | Site icon |

---

## Advanced: Multiple Pages

If you add additional pages (e.g., `/schedule`, `/speakers`):

1. **Add to sitemap.xml**:
```xml
<url>
  <loc>https://your-workshop-domain.com/schedule</loc>
  <lastmod>2026-01-15</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

2. **Add meta tags to page component**:
```typescript
export const meta: Route.MetaFunction = () =>
  buildMeta({
    title: "Schedule | Your Workshop Name",
    description: "Detailed schedule for the workshop",
    path: "/schedule",
  });
```

---

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Event](https://schema.org/Event)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

## Support

For questions about SEO configuration:
1. Check this guide first
2. Test with validation tools listed above
3. Review the [main README.md](./README.md) for general setup

---

**Last Updated**: 2026-04-29  
**Template Version**: 1.0.0
