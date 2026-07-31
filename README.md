# Visuals by Pritam

A premium creative portfolio CMS built with React 19, Vite, TypeScript, Tailwind CSS v4, and Supabase.

## Overview

Visuals by Pritam is a lightweight CMS where the owner logs into an admin dashboard and uploads creative work (videos, photos, banners) that automatically appears on the public portfolio. The architecture is scalable enough to support multiple users without requiring a major rewrite.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite | Build tool and dev server |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling with Apple-inspired design tokens |
| React Router DOM | Client-side routing |
| Supabase | Backend (auth, storage, database) |
| TanStack Query | Server state management |
| React Hook Form + Zod | Form handling and validation |
| Lucide React | Icon library |
| Framer Motion | Animations |
| Sonner | Toast notifications |
| clsx + class-variance-authority | Utility classes and component variants |

## Project Structure

```
src/
  app/
    router/              # Router configuration
    layouts/             # Public and admin layouts
    providers/           # App-wide providers (auth, query, toast, motion)
  assets/
    icons/               # SVG icons
    images/              # Image assets
    fonts/               # Custom fonts
  components/
    ui/                  # Reusable design system components
    common/              # Shared components (loading, error boundary)
    layout/              # Header, footer, navbar
    portfolio/           # Portfolio-specific components
    admin/               # Admin-specific components
  features/
    auth/                # Authentication feature module
    dashboard/           # Dashboard feature module
    portfolio/           # Portfolio feature module
    contact/             # Contact feature module
    settings/            # Settings feature module
  hooks/                 # Custom hooks
  integrations/supabase/ # Supabase client, storage, auth, and data access
  repositories/          # Repository classes for data access
  media/                 # Media processing (compress, thumbnail, validate)
  upload/                # Upload manager orchestrator
  pages/
    public/              # Public-facing pages
    admin/               # Admin dashboard pages
  routes/                # Route definitions
  contexts/              # React contexts
  animations/            # Framer Motion variants
  config/                # Site config and upload configuration
  constants/             # Application constants
  services/              # API service layer (delegates to repositories)
  styles/                # Global styles and design tokens
  types/                 # TypeScript type definitions
  lib/
    supabase/            # Supabase client and storage (backward compat)
    utils/               # Utility functions
    validations/         # Zod validation schemas
```

## Architecture

### Data Flow

```
Upload Form
  → Upload Manager
    → Media Processing (compress, thumbnail, validate)
      → Supabase Storage
        → Database (via Repository)
```

### Key Principles

- **No React component directly communicates with Supabase** — all data access goes through Repository classes
- **Upload Manager** is the single place for uploading images and videos
- **Media Processing Layer** handles compression, thumbnail generation, and validation
- **Repository pattern** abstracts database operations
- **Feature-based module organization** for scalability

### Roles

| Role | Access |
|------|--------|
| admin | Full access to dashboard and settings |
| editor | Can manage portfolio items (future) |

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/K7SUNNY/visuals-by-pritam
cd visuals-by-pritam

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
```

### Environment Variables

Create a `.env.local` file with the following:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema in `supabase/setup.sql` to create tables, RLS policies, and storage buckets
3. The setup script creates:
   - `profiles` table with user roles
   - `portfolio_items` table for creative work
   - `categories` table for organizing work
   - `settings` table for site configuration
   - `portfolio-media` storage bucket with public read and authenticated write policies
   - A trigger to auto-create profiles on user signup

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Lint and fix
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Design System

### Apple-Inspired Design Tokens

The design system uses semantic tokens for colors, typography, spacing, shadows, and radii:

- **Colors**: Primary (`#007AFF`), Success, Warning, Error, Info with light variants
- **Typography**: Apple system font stack (`-apple-system`, SF Pro), 8 size scale
- **Spacing**: 4px grid scale (4px → 80px)
- **Shadows**: Soft, subtle shadows (`shadow-card`, `shadow-modal`)
- **Radii**: 4px → 9999px (full)
- **Dark mode**: Complete dark theme via `.dark` class

### Reusable Components

| Component | Description |
|-----------|-------------|
| `Typography` | Semantic heading/body/caption/overline |
| `Button` | 5 variants, 3 sizes, loading state, icon support |
| `Input` | Label, error, helper text, addons |
| `Badge` | 7 variants, 2 sizes |
| `Card` | 4 padding sizes, 4 shadow sizes, hover state |
| `Modal` | Overlay with backdrop blur, title/description, footer |
| `Dialog` | Confirmation dialog variant |
| `Tabs` | Compound component with ARIA |
| `Skeleton` | Loading placeholders (text, card) |
| `EmptyState` | Empty state with icon, description, action |
| `ErrorState` | Error state with retry button |

## Admin Dashboard

### Pages

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard overview |
| `/admin/dashboard` | Stats and recent activity |
| `/admin/works` | Manage portfolio items (grid, search, filter, edit, delete) |
| `/admin/upload` | Upload new work (drag & drop, preview, publish) |
| `/admin/settings` | Brand identity, contact details, social links, theme |

### Upload Flow

1. **Upload Form** — Drag & drop or click to browse files
2. **Upload Manager** — Orchestrates the entire upload process
3. **Media Processing** — Compresses images, generates thumbnails, validates files
4. **Supabase Storage** — Uploads to the `portfolio-media` bucket
5. **Database** — Creates portfolio item record with metadata

## Public Website

### Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, featured work, gallery, about, contact |
| `/portfolio` | Full portfolio gallery with category filters |
| `/contact` | Contact form |

### Features

- Responsive design
- Lazy-loaded images and videos
- Category filters with Framer Motion animations
- Smooth scroll-triggered animations
- Minimal Apple-style design

## License

All Rights Reserved.

## Links

- **Repository**: [github.com/K7SUNNY/visuals-by-pritam](https://github.com/K7SUNNY/visuals-by-pritam)
- **Live Demo**: [visualsbypritam.com](https://visualsbypritam.com)
- **LinkedIn**: [linkedin.com/in/k7sunny](https://www.linkedin.com/in/k7sunny/)
- **GitHub**: [github.com/K7SUNNY](https://github.com/K7SUNNY)