# Workshop Website Template

A modern, customizable template for academic workshop websites. Built with React Router 7, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design with dark/light mode support
- 📱 Mobile-friendly navigation
- 🎯 Pre-built sections: Home, Program, Call for Papers, Schedule, Organizers, Awards, Contact
- 🎭 Animated background with WebGL Orb effect
- 📝 JSON-based content management (no database required)
- 🚀 Fast development with Vite and HMR
- 🐳 Docker support for easy deployment
- ⚡ SEO-optimized with structured data, meta tags, and sitemaps (see [SEO_GUIDE.md](./SEO_GUIDE.md))

## Quick Start

### Prerequisites

- Node.js 22 LTS+ or use mise (configured via `.mise.toml`)
- Yarn package manager

### Installation

1. Clone or copy this template:
```bash
cp -r workshop-template your-workshop-name
cd your-workshop-name
```

2. Install dependencies:
```bash
yarn install
```

3. Start development server:
```bash
yarn dev
```

Visit http://localhost:5173 to see your workshop website.

## Customization Guide

### 1. Update Basic Information

Edit the JSON files in `src/data/`. The template uses 3 main files:

#### **workshop.json** - Main workshop information
- `home` - Workshop title, tagline, overview, dates, news
- `schedule` - Workshop schedule and timeline
- `callForPapers` - Submission guidelines, important dates, topics
- `contact` - Contact information and FAQ

#### **people.json** - People information
- `organizers` - Organizing team members
- `program` - Invited speakers, accepted papers, panel discussions

#### **extras.json** - Optional sections (can be removed if not needed)
- `awards` - Award categories and winners
- `supporters` - Sponsors and supporters
- `pastEvents` - Previous workshop editions and resources

### 2. Replace Images

Place your images in the `public/` directory:

- `/public/organizers/` - Organizer photos (recommended: 302x302px)
- `/public/program/` - Speaker photos (recommended: 512x512px)
- `/public/supporters/` - Sponsor logos (recommended: 512x512px)
- `/public/` - Cover images, logos, OGP images

Default images included:
- `bigmac-cover.jpg` - Hero section background
- `bigmac-ogp.jpg` - Social media preview image
- `favicon.ico` - Browser tab icon

### 3. Update Branding

Edit `package.json`:
```json
{
  "name": "your-workshop-name",
  "description": "Your workshop description"
}
```

Update SEO metadata in `src/lib/seo.ts`.

### 4. Customize Styling

The template uses Tailwind CSS. Main style files:
- `src/app/app.css` - Global styles and Tailwind imports
- `src/components/ui/` - Reusable UI components

### 5. Modify Sections

Main page component: `src/app/routes/Home.tsx`

You can:
- Comment out sections you don't need
- Reorder sections
- Add custom sections

Example - Remove Awards section:
```tsx
{/* <Awards /> */}
```

## Project Structure

```
workshop-template/
├── src/
│   ├── app/
│   │   ├── routes/       # Page components
│   │   ├── layout.tsx    # Site layout
│   │   └── root.tsx      # App root
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI component library
│   │   ├── header.tsx   # Navigation header
│   │   ├── footer.tsx   # Page footer
│   │   └── Orb.tsx      # WebGL background effect
│   ├── data/            # Content JSON files
│   └── lib/             # Utility functions
├── public/              # Static assets
├── environments/        # Docker configs
└── package.json
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run linters (ESLint + Prettier)
- `yarn format` - Auto-format code

## Deployment

### Docker

Build and run with Docker Compose:

```bash
# Development
cd environments/dev
docker-compose up

# Production
cd environments/ci
docker-compose up
```

### Static Deployment

Build the site:
```bash
yarn build
```

Deploy the `build/` directory to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Environment Variables

Copy `environments/envs.env.sample` to `environments/envs.env` and configure:

```env
NODE_ENV=production
PORT=3000
```

## GitHub Actions

Pre-configured workflows in `.github/workflows/`:
- `ci.yaml` - Run tests and linting on pull requests
- `deploy.yaml` - Deploy to production

Update the deployment workflow with your hosting service credentials.

## Tech Stack

- **Framework**: React Router 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React, React Icons
- **3D Graphics**: OGL (WebGL library)
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier

## Documentation

- **[TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)**: Step-by-step customization guide with checklists
- **[SEO_GUIDE.md](./SEO_GUIDE.md)**: Complete SEO optimization guide (essential for workshop discoverability)
- **[DATA_STRUCTURE.md](./DATA_STRUCTURE.md)**: JSON data structure reference

## Tips

1. **Fast development**: Edit JSON files in `src/data/` for quick content updates
2. **Image optimization**: Compress images before adding to `public/`
3. **Accessibility**: All UI components are built with Radix UI for a11y
4. **Performance**: The template uses lazy loading and code splitting
5. **SEO**: See [SEO_GUIDE.md](./SEO_GUIDE.md) for comprehensive optimization instructions

## License

This template is based on the BigMAC Workshop website. Feel free to use it for your academic workshops.

## Support

For issues or questions about this template:
1. Check existing workshop implementations for examples
2. Review component documentation in `src/components/ui/`
3. Consult React Router 7 documentation: https://reactrouter.com/

---

Created for academic workshop organizers. Happy coding!
