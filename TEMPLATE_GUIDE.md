# Workshop Template Customization Guide

This guide will help you quickly customize this template for your workshop.

## Quick Start Checklist

Follow these steps to get your workshop website up and running:

### 1. Basic Setup (5 minutes)

- [ ] Update `package.json`:
  - Change `name` to your workshop name
  - Update `description`

### 2. Content Updates (15-30 minutes)

The template uses **3 JSON files** for all content:

#### **src/data/workshop.json** - Main workshop information

- [ ] Update `home` section:
  - Set your workshop title and tagline
  - Update conference name and subtitle
  - Add event date and location
  - Write workshop overview and mission
  - List key topics
  - Set important dates
  - Add latest news items

- [ ] Update `schedule` section:
  - Set important dates (submission, notification, workshop)
  - Create workshop program schedule
  - Update presenter guidelines

- [ ] Update `callForPapers` section:
  - Customize topic areas
  - Set submission guidelines
  - Update review process description
  - Adjust FAQ items

- [ ] Update `contact` section:
  - Set contact email
  - Update venue location
  - Add social media links
  - Customize FAQ

#### **src/data/people.json** - People information

- [ ] Update `organizers` section:
  - Add organizer information (name, affiliation, photo, website)
  - Replace placeholder photos in `/public/organizers/`

- [ ] Update `program` section:
  - Add invited speakers
  - Update panel discussion details
  - Keep TBA entries if speakers not yet confirmed

#### **src/data/extras.json** - Optional sections (10-20 minutes)

- [ ] Update `awards` section (or remove if not offering awards):
  - Customize award categories
  - Update selection criteria
  - Set committee members

- [ ] Update `supporters` section:
  - Add sponsor logos to `/public/supporters/`
  - Update sponsor information

- [ ] Update `pastEvents` section (or remove if this is the first edition):
  - Add previous workshop editions
  - Add past papers and keynotes

### 4. Branding & Assets (20-40 minutes)

Replace images in `/public/`:

- [ ] `favicon.ico` - Browser tab icon
- [ ] `hero-background.jpg` - Hero section background image (1920x1080 or higher recommended)
- [ ] `bigmac-ogp.jpg` - Social media preview image (1200x630 recommended, rename to match your workshop)
- [ ] Conference logos if needed (currently using CVPR logos as examples)

Replace photos:
- [ ] `/public/organizers/` - Organizer photos (302x302px recommended)
- [ ] `/public/program/` - Speaker photos (512x512px recommended)
- [ ] `/public/supporters/` - Sponsor logos (512x512px recommended)

### 5. SEO & Metadata (15-20 minutes)

**IMPORTANT**: SEO is critical for workshop discoverability. See [SEO_GUIDE.md](./SEO_GUIDE.md) for detailed instructions.

- [ ] Update `src/lib/seo.ts`:
  - Set SITE_URL, SITE_NAME
  - Update description (150-160 characters)
  - Add relevant keywords (5-10 terms)
  - Update OGP image paths

- [ ] Update structured data in `src/app/routes/Home.tsx` (line ~60-80):
  - Workshop name and description
  - Start/end date and time (ISO 8601 format: `YYYY-MM-DDTHH:MM:SS`)
  - Full location address
  - Organizer information
  - Event attendance mode (offline/online/hybrid)

- [ ] Update `public/sitemap.xml`:
  - Change all URLs to your domain
  - Update lastmod date

- [ ] Update `public/robots.txt`:
  - Change sitemap URL to your domain

- [ ] Replace OGP image:
  - Upload `public/your-workshop-ogp.jpg` (1200x630px)
  - Update reference in `src/lib/seo.ts`

**Testing** (Required):
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validate with [Schema.org Validator](https://validator.schema.org/)
- [ ] Preview on [Facebook Debugger](https://developers.facebook.com/tools/debug/)

→ **See [SEO_GUIDE.md](./SEO_GUIDE.md) for complete instructions**

### 6. Deployment Setup (10-20 minutes)

- [ ] Update `.github/workflows/deploy.yaml`:
  - Configure deployment target
  - Set environment variables
  - Update secrets if needed

- [ ] Update `environments/ci/.env`:
  - Set production environment variables

- [ ] Update Docker configs if using containers

### 7. Remove Template-Specific Content

- [ ] Review and remove BigMAC-specific content:
  - Update README.md citations if needed
  - Remove this TEMPLATE_GUIDE.md after reading

## Testing Your Changes

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start development server:
   ```bash
   yarn dev
   ```

3. Visit http://localhost:5173

4. Check each section:
   - [ ] Home page displays correctly
   - [ ] All navigation links work
   - [ ] Images load properly
   - [ ] Content is accurate
   - [ ] Mobile view works well
   - [ ] Dark/light mode toggles

5. Run linting:
   ```bash
   yarn lint
   ```

## Common Customizations

### Hiding Sections

To hide a section you don't need, comment it out in `src/app/routes/Home.tsx`:

```tsx
{/* <Awards /> */}
{/* <PastEvents /> */}
```

### Reordering Sections

Simply rearrange the section components in `src/app/routes/Home.tsx`:

```tsx
<Hero />
<Overview />
<Program />      {/* Moved up */}
<Schedule />
<CallForPapers />  {/* Moved down */}
// ... etc
```

### Changing Colors

Update Tailwind theme in `src/app/app.css`:

```css
@theme {
  --color-primary: #your-color;
  --color-secondary: #your-color;
}
```

### Adding Custom Sections

1. Create a new component in `src/components/`
2. Import and add it to `src/app/routes/Home.tsx`
3. Create corresponding JSON in `src/data/` if needed

## File Structure Reference

```
src/
├── data/              # All content lives here (JSON - only 3 files!)
│   ├── workshop.json  # Main workshop info (home, schedule, CFP, contact)
│   ├── people.json    # Organizers and speakers
│   └── extras.json    # Optional sections (awards, supporters, past events)
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components (buttons, cards, etc.)
│   ├── header.tsx    # Navigation
│   ├── footer.tsx    # Footer
│   └── Orb.tsx       # Background animation
├── app/
│   ├── routes/       # Page components
│   │   └── Home.tsx  # Main landing page
│   ├── layout.tsx    # Site layout wrapper
│   └── root.tsx      # App root
└── lib/              # Utility functions
    ├── seo.ts        # SEO metadata
    └── utils.ts      # Helper functions
```

## Tips for Success

1. **Start with data files**: Update all JSON files first, then check the UI
2. **Optimize images**: Compress images before uploading to reduce load time
3. **Test mobile**: Always check mobile view - many attendees browse on phones
4. **Keep it simple**: Don't add features you don't need
5. **Version control**: Commit changes frequently with clear messages
6. **Accessibility**: The template uses Radix UI for a11y - maintain this when customizing

## Need Help?

- Check the main `README.md` for technical documentation
- Review component files in `src/components/` for implementation details
- Consult React Router docs: https://reactrouter.com/
- Look at the original BigMAC workshop for a working example

## Next Steps After Customization

1. Build for production: `yarn build`
2. Test production build: `yarn start`
3. Deploy to your hosting service
4. Share your workshop URL!
5. Update content as your workshop schedule develops

---

Good luck with your workshop! 🎉
