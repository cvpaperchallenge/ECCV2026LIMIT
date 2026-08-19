# LIMIT Workshop @ ECCV 2026

**LIMIT: Representation Learning with Very Limited Resources**
*When Data, Modalities, Labels, and Computing Resources are Scarce*

ECCV 2026 Workshop | September 8–9, 2026 (TBD) | Malmö, Sweden

- Website: https://eccv2026-limit-workshop.limitlab.xyz/
- Contact: ryousuke.yamada[at]aist.go.jp
- Slack: [LIMIT.Community](https://join.slack.com/t/limit-community/shared_invite/zt-1oov3gv0h-kaLICu0jm_wzm0_H6D46Lw)

## About

This workshop aims to bring together researchers and practitioners to discuss the latest advances and challenges in representation learning under limited-resource settings. We focus on innovative approaches for learning with scarce data, labels, modalities, and computing resources, including self-supervised, semi-supervised, few-shot, and synthetic data-driven methods.

### Topics

- Recognition, generation, reconstruction, any visual/multi-modal tasks in limited situations
- {Self, Semi, Weakly, Un}-supervised learning with very limited resources
- {Zero, One, Few}-shot learning with very limited resources
- Training convnets, transformers, diffusion, foundation models with relatively fewer resources
- Synthetic training with procedural, artificially generated images

### Past Workshops

| Year | Conference | URL |
|------|-----------|-----|
| 2025 | ICCV | https://limit-workshop.github.io/ |
| 2024 | CVPR | https://hirokatsukataoka16.github.io/CVPR-2024-LIMIT |
| 2023 | ICCV | https://lsfsl.net/limit23/ |

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) 22 LTS or later (or use [mise](https://mise.jdx.dev/) — configured via `.mise.toml`)
- [Yarn](https://yarnpkg.com/) package manager

### Setup

```bash
git clone git@github.com:cvpaperchallenge/ECCV2026LIMIT.git
cd ECCV2026LIMIT
yarn install
```

### Dev Server

```bash
yarn dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
yarn build
```

The production output is generated in `build/client/`. This is a fully static site (SPA mode) that can be hosted on any static file server.

### Lint & Format

```bash
yarn lint      # ESLint + Prettier check
yarn format    # Auto-format
```

### Docker

Docker Compose configurations are provided in `environments/`.

```bash
# Development
cd environments/dev
docker compose up

# CI / Production build
cd environments/ci
docker compose up
```

## Deployment

The site is automatically deployed to GitHub Pages on every push to the `develop` branch via GitHub Actions (`.github/workflows/deploy.yaml`). The custom domain `eccv2026-limit-workshop.limitlab.xyz` is configured to point to this deployment.

Manual deployment is also possible — run `yarn build` and serve the `build/client/` directory with any static hosting service.

## Project Structure

```
ECCV2026LIMIT/
├── src/
│   ├── app/
│   │   ├── routes/Home.tsx   # Main page (all sections)
│   │   ├── layout.tsx        # Site layout
│   │   ├── root.tsx          # App root
│   │   └── app.css           # Global styles and color palette
│   ├── components/
│   │   ├── ui/               # UI component library (shadcn/ui)
│   │   ├── header.tsx        # Navigation header
│   │   ├── footer.tsx        # Page footer
│   │   └── Orb.tsx           # WebGL animated background
│   ├── data/
│   │   ├── workshop.json     # Workshop content (title, dates, CFP, schedule, contact)
│   │   ├── people.json       # Organizers and speakers
│   │   └── extras.json       # Past events, awards, supporters
│   └── lib/
│       ├── seo.ts            # SEO metadata and OGP settings
│       ├── structured-data.ts # JSON-LD structured data
│       └── calendar.ts       # Date utilities and ICS generation
├── public/
│   ├── organizers/           # Organizer photos (302x302px recommended)
│   ├── program/              # Speaker photos (512x512px recommended)
│   ├── hero-background.jpg   # Hero section background (~2560x1024px recommended)
│   ├── eccv-navbar-logo.svg  # ECCV 2026 conference logo
│   ├── favicon.ico           # Browser tab icon
│   ├── sitemap.xml           # Sitemap
│   └── robots.txt            # Robots configuration
├── environments/             # Docker Compose configs
├── .github/workflows/        # CI/CD (lint, build, deploy)
└── package.json
```

## How to Edit Content

Most content updates only require editing JSON files in `src/data/` — no code changes needed.

| What to update | File |
|---------------|------|
| Title, dates, overview, CFP, schedule, contact | `src/data/workshop.json` |
| Organizers, invited speakers | `src/data/people.json` |
| Past events, awards, supporters | `src/data/extras.json` |
| SEO metadata, OGP | `src/lib/seo.ts` |
| Color palette | `src/app/app.css` |
| Navigation links (shared by header and footer) | `src/lib/navigation.ts` |
| Footer-only links (past/related workshops, share) | `src/components/footer.tsx` |

To show/hide sections (e.g., Program, Invited Speakers), comment out or uncomment the corresponding blocks in `src/app/routes/Home.tsx`.

## Tech Stack

- **Framework**: [React Router 7](https://reactrouter.com/) (SPA mode)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives (via shadcn/ui)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **3D Graphics**: [OGL](https://oframe.github.io/ogl/) (WebGL)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Linting**: ESLint + Prettier
