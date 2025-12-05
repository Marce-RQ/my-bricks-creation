# PRD: MyBricksCreations.com

**Project Name:** MyBricksCreations  
**Domain:** MyBricksCreations.com  
**Type:** Bilingual Portfolio & Donation Site for a Young Lego Creator  
**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Supabase (Auth, DB, Storage), next-intl  
**Developer:** Solo developer learning full-stack development with AI copilot

---

## 1. Core Concept

A personal bilingual portfolio for a young "Master Builder" to showcase Lego creations. Features a gallery of builds with stories, multiple images per build, crypto donation options, and full English/Spanish language support.

---

## 2. User Roles

### Public User

-   View gallery of published builds
-   Read build details and stories
-   Access support page with donation QR codes
-   Switch between English and Spanish
-   No login required

### Admin (You/Parent)

-   Full content management via admin panel
-   Create, edit, and delete posts
-   Upload and manage images (1-4 per build)
-   Select cover image for each build
-   Toggle post status (draft/published)

---

## 3. Internationalization (i18n)

### Configuration

-   **Library:** `next-intl`
-   **Supported Locales:** English (`en`), Spanish (`es`)
-   **Default Locale:** English

### Implementation

-   All routes prefixed with locale (e.g., `/en/builds/my-creation`, `/es/builds/my-creation`)
-   Translation files in `messages/` folder
-   `LanguageSwitcher` component in header with flag icons
-   Middleware handles locale detection and routing

### Translation Structure

```
messages/
├── en.json    # English translations
└── es.json    # Spanish translations
```

---

## 4. Design System

### Philosophy

**"Playful Minimalism"** - Clean layout to showcase the builds with friendly UI elements.

### Color Palette

**Primary Colors:**

-   **Lego Red:** `#DA291C` (primary buttons, accents)
-   **Lego Yellow:** `#FFD500` (highlights, badges)
-   **Lego Blue:** `#0055BF` (secondary actions)

**Extended Shades (50-900):**

```
lego-red:    #FEF2F1 → #DA291C → #711817
lego-yellow: #FFFCE5 → #FFD500 → #724B10
lego-blue:   #EFF6FF → #0055BF → #00285B
```

**Neutrals:**

-   **Background:** White (`#FFFFFF`) or light grey (`#F8F9FA`)
-   **Text:** Dark grey (`#1F1F1F`) body, black headings

### Typography

-   **Headings:** Nunito (rounded, friendly)
-   **Body:** Inter (clean, readable)
-   **Responsive sizes:** Mobile-first approach

### UI Components

-   **Buttons:** Rounded corners (12px), hover animations, shadow effects
    -   Primary: Red with glow shadow
    -   Secondary: Blue solid
    -   Outline: Red border, fill on hover
    -   Ghost: Transparent with hover background
    -   Gradient: Red gradient with elevated shadow
-   **Cards:** Soft shadows, hover lift effect (16px radius)
-   **Images:** Rounded corners (12px), lazy loading
-   **Forms:** Clear labels, inline validation
-   **Header:** Glass morphism effect, sticky positioning
-   **Notifications:** Toast messages for user feedback

### Animations

-   Float: Gentle up/down movement
-   Pulse-soft: Subtle breathing effect
-   Slide-up: Content entrance
-   Fade-in: Smooth opacity transition
-   Bounce: Playful decorative elements

---

## 5. Pages & Features

### Home Page (`/[locale]/`)

-   **Hero Section:**

    -   Avatar/profile image with decorative floating bricks
    -   "Master Builder" badge
    -   "About Me" blurb (2-3 sentences)
    -   Stats display (creations count, total pieces)
    -   Buttons: Explore Gallery, Support My Journey

-   **Gallery Grid:**

    -   Shows all published builds
    -   Responsive: 1 column (mobile), 2 (tablet), 3 (desktop)
    -   Each card: Cover image, title, piece count
    -   Newest first

-   **Call-to-Action Section:**
    -   Encouragement to support
    -   Link to support page

### Build Details Page (`/[locale]/builds/[slug]`)

-   **Image Carousel:** Up to 4 images with thumbnails
-   **Build Info:**
    -   Title
    -   Story/description
    -   Piece count badge
    -   Published date
    -   Start and completion dates
    -   Back to gallery link
-   **Support CTA:** Encouragement to donate

### Support Page (`/[locale]/support`)

-   QR codes for BTC, ETH, SOL
-   Wallet addresses with click-to-copy functionality
-   Brief explanation of donations
-   Thank you message

### Admin Login (`/[locale]/admin/login`)

-   Email/password form
-   Error message display
-   Redirect to dashboard on success

### Admin Dashboard (`/[locale]/admin`)

-   **Stats Overview:**
    -   Total builds count
    -   Published vs drafts
    -   Storage usage indicator
-   **Quick Actions:**
    -   Create new build
    -   Manage posts
    -   View public site
-   **Navigation:** Sidebar with links

### Post Manager (`/[locale]/admin/posts`)

-   List of all posts
-   Filter by status (all/drafts/published)
-   Edit/delete actions per post
-   Status badges

### Post Editor (`/[locale]/admin/posts/new` & `/[locale]/admin/posts/edit/[id]`)

-   **Form Fields:**
    -   Title input
    -   Description textarea
    -   Piece count number input
    -   Date pickers (start/completed)
    -   Status toggle (draft/published)
-   **Image Uploader:**
    -   Drag-and-drop zone
    -   Support for 1-4 images
    -   Cover image selection
    -   Image preview with remove option
    -   Display order management

---

## 6. Database Schema (Supabase)

### Table: `posts`

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  piece_count INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  date_start TIMESTAMPTZ,
  date_completed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_slug ON posts(slug);
```

**RLS Policies:**

```sql
-- Public can view published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published');

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access" ON posts
  FOR ALL USING (auth.role() = 'authenticated');
```

### Table: `post_images`

```sql
CREATE TABLE post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_post_images_post_id ON post_images(post_id);
CREATE INDEX idx_post_images_display_order ON post_images(display_order);
```

**RLS Policies:**

```sql
-- Public can view images of published posts
CREATE POLICY "Public can view published post images" ON post_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_images.post_id
      AND posts.status = 'published'
    )
  );

-- Authenticated users can manage all images
CREATE POLICY "Authenticated users full access" ON post_images
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 7. Image Handling

### Accepted Formats

-   JPEG/JPG
-   PNG
-   WebP

### Upload Constraints

-   Max file size: 5MB per image
-   Max images per build: 4
-   Validation on client and server

### Features

-   **Drag-and-drop upload** using react-dropzone
-   **Cover image selection:** First image or user-selected
-   **Display order:** Configurable order for carousel

### Storage

-   **Location:** Supabase Storage bucket `build-images`
-   **Folder:** `/{post-id}/{filename}`
-   **Optimization:** Next.js Image component
    -   Sizes: [640, 750, 828, 1080, 1200, 1920]
    -   Quality: 85
    -   Target: ~300KB per image

---

## 8. SEO Basics

### Meta Tags

-   **Title:** `{Build Title} | MyBricksCreations`
-   **Description:** First 160 chars of description
-   **Open Graph:** og:image, og:type, og:url

### URL Structure (Localized)

-   Gallery: `/en/` or `/es/`
-   Build: `/en/builds/{slug}` or `/es/builds/{slug}`
-   Support: `/en/support` or `/es/support`
-   Admin: `/en/admin` or `/es/admin`

---

## 9. Storage Management

### Supabase Free Tier

-   **Total Storage:** 1GB
-   **Target Usage:** ~240MB for 200 builds
-   **Dashboard Display:** Progress bar showing usage
-   **Warning:** Alert at 80% (800MB)

---

## 10. Error Handling

### Upload Failures

-   Toast notification: "Upload failed, please try again"
-   Allow retry without losing form data

### Authentication

-   Failed login: Error message below form
-   Session expired: Redirect to login with message

### Form Validation

-   Client-side HTML5 validation
-   Title: 3-100 characters
-   Piece count: Positive integer
-   Dates: Start before completion

### 404 Errors

-   Custom 404 page with link back to gallery
-   Localized error messages

---

## 11. Security

### Supabase RLS

-   Public: View published posts and images only
-   Authenticated: Full access to all posts and images

### File Upload Security

-   Validate MIME type and file size on client
-   Re-validate on server
-   Only authenticated users can upload

### Environment Variables

-   **Client (NEXT*PUBLIC*\*):**
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-   **Server only:**
    -   `SUPABASE_SERVICE_ROLE_KEY`
    -   `BTC_ADDRESS`, `ETH_ADDRESS`, `SOL_ADDRESS`

---

## 12. Deployment

### Hosting

-   **Platform:** Vercel (free tier)
-   **Auto Deploy:** Push to `main` branch
-   **Preview:** Feature branches get preview URLs

### Branch Strategy

-   `main`: Production
-   `dev`: Development/staging
-   `feature/*`: Individual features

---

## 13. Dependencies

```json
{
	"dependencies": {
		"@supabase/ssr": "^0.8.0",
		"@supabase/supabase-js": "^2.86.0",
		"next": "14.2.33",
		"next-intl": "^4.5.8",
		"react": "^18",
		"react-dom": "^18",
		"react-dropzone": "^14.3.8",
		"react-hot-toast": "^2.6.0"
	},
	"devDependencies": {
		"@types/node": "^20",
		"@types/react": "^18",
		"@types/react-dom": "^18",
		"eslint": "^8",
		"eslint-config-next": "14.2.33",
		"postcss": "^8",
		"tailwindcss": "^3.4.1",
		"typescript": "^5"
	}
}
```

---

## 14. Project Structure

```
mybrickscreations/
├── app/
│   ├── globals.css               # Global styles & component classes
│   ├── layout.tsx                # Root layout
│   └── [locale]/                 # Locale-based routing
│       ├── page.tsx              # Home/Gallery
│       ├── layout.tsx            # Locale layout with providers
│       ├── not-found.tsx         # 404 page
│       ├── builds/
│       │   └── [slug]/
│       │       └── page.tsx      # Build detail
│       ├── support/
│       │   └── page.tsx          # Donation page
│       └── admin/
│           ├── layout.tsx        # Protected admin layout
│           ├── page.tsx          # Dashboard
│           ├── login/
│           │   └── page.tsx      # Login page
│           └── posts/
│               ├── page.tsx      # Post manager
│               ├── new/
│               │   └── page.tsx  # Create post
│               └── edit/
│                   └── [id]/
│                       └── page.tsx  # Edit post
├── components/
│   ├── AdminNav.tsx              # Admin sidebar navigation
│   ├── BuildCard.tsx             # Gallery card component
│   ├── CopyButton.tsx            # Click-to-copy wallet addresses
│   ├── Footer.tsx                # Site footer
│   ├── Header.tsx                # Site header with nav
│   ├── ImageCarousel.tsx         # Build image viewer
│   ├── ImageUploader.tsx         # Drag-drop image upload
│   ├── LanguageSwitcher.tsx      # EN/ES toggle
│   ├── LoginForm.tsx             # Admin login form
│   ├── PostForm.tsx              # Create/edit post form
│   └── PostList.tsx              # Admin post list
├── i18n/
│   ├── config.ts                 # Locale configuration
│   ├── navigation.ts             # Localized navigation helpers
│   ├── request.ts                # Server-side i18n
│   └── routing.ts                # Routing configuration
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Utility functions
│   └── supabase/
│       ├── client.ts             # Browser Supabase client
│       ├── middleware.ts         # Auth session handler
│       └── server.ts             # Server Supabase client
├── messages/
│   ├── en.json                   # English translations
│   └── es.json                   # Spanish translations
├── supabase/
│   └── migrations/               # SQL migration scripts
│       ├── 001_create_tables.sql
│       └── 002_storage_policies.sql
├── public/
│   ├── avatar.svg                # Profile avatar
│   ├── header-brand-image.png    # Logo/brand image
│   └── ...                       # Other static assets
├── middleware.ts                 # Combined auth + i18n middleware
├── .env.local                    # Environment variables
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## 15. Out of Scope (V1)

Not included in first version:

-   ❌ Comments or reactions
-   ❌ Search functionality
-   ❌ User accounts for supporters
-   ❌ Traditional payment methods
-   ❌ Build instructions/PDFs
-   ❌ Analytics
-   ❌ Email notifications
-   ❌ Social sharing buttons
-   ❌ Multiple admin accounts
-   ❌ Categories or tags
-   ❌ Dark mode
-   ❌ Additional languages beyond EN/ES

---

**Document Version:** 1.0  
**Created:** December 2025  
**Creator:** Marcelo Romero
