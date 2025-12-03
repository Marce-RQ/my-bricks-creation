# PRD: MyBricksCreations.com (Simplified for Solo Dev)

**Project Name:** MyBricksCreations  
**Domain:** MyBricksCreations.com  
**Type:** Portfolio & Donation Site for a Young Lego Creator  
**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Supabase (Auth, DB, Storage)  
**Developer:** Solo developer learning full-stack development with AI copilot

---

## 1. Core Concept

A personal portfolio for a young "Master Builder" to showcase Lego creations. Features a gallery of builds with stories, multiple images per build, and crypto donation options.

---

## 2. User Roles

### Public User

-   View gallery of published builds
-   Read build details and stories
-   Access support page with donation QR codes
-   No login required

### Admin (You/Parent)

-   Full content management via admin panel
-   Create, edit, and delete posts
-   Upload and manage images (1-4 per build)
-   Toggle post status (draft/published)

---

## 3. Design System

### Philosophy

**"Playful Minimalism"** - Clean layout to showcase the builds with friendly UI elements.

### Color Palette

-   **Background:** White (`#FFFFFF`) or light grey (`#F5F5F5`)
-   **Primary Buttons:** Lego Red (`#DA291C`)
-   **Accents:** Lego Yellow (`#FFD500`) and Blue (`#0055BF`)
-   **Text:** Dark grey (`#1F1F1F`) body, black headings

### Typography

-   **Headings:** Rounded font (Nunito or Fredoka)
-   **Body:** Clean sans-serif (Inter or Geist)
-   **Responsive sizes:** Mobile-first approach

### UI Components

-   **Buttons:** Rounded corners (8px), hover animations
-   **Cards:** Soft shadows, hover lift effect
-   **Images:** Rounded corners (12px), lazy loading
-   **Forms:** Clear labels, inline validation

---

## 4. Pages & Features

### Home Page (`/`)

-   **Hero Section:**
    -   Avatar/profile image
    -   "About Me" blurb (2-3 sentences)
    -   Button to support page
-   **Gallery Grid:**
    -   Shows all published builds
    -   Responsive: 1 column (mobile), 2 (tablet), 3 (desktop)
    -   Each card: Image, title, piece count
    -   Newest first

### Build Details Page (`/builds/[slug]`)

-   **Image Carousel:** Up to 4 images with thumbnails
-   **Build Info:**
    -   Title
    -   Story/description
    -   Piece count
    -   Start and completion dates
    -   Back to gallery link

### Support Page (`/support`)

-   QR codes for BTC, ETH, SOL
-   Wallet addresses (click to copy)
-   Brief explanation of donations

### Admin Dashboard (`/admin`)

-   **Login:** Email/password form
-   **Dashboard:**
    -   Stats: Total builds, storage usage
    -   Post list with edit/delete actions
    -   Filter by status (all/drafts/published)
-   **Post Editor:**
    -   Title, description, piece count
    -   Date pickers
    -   Image uploader (drag-and-drop, 1-4 images)
    -   Save as draft or publish

---

## 5. Database Schema (Supabase)

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

## 6. Image Handling

### Accepted Formats

-   JPEG/JPG
-   PNG
-   WebP

### Upload Constraints

-   Max file size: 5MB per image
-   Max images per build: 4
-   Validation on client and server

### Storage

-   **Location:** Supabase Storage bucket `build-images`
-   **Folder:** `/{post-id}/{filename}`
-   **Optimization:** Next.js Image component
    -   Sizes: [640, 750, 828, 1080, 1200, 1920]
    -   Quality: 85
    -   Target: ~300KB per image

---

## 7. SEO Basics

### Meta Tags

-   **Title:** `{Build Title} | MyBricksCreations`
-   **Description:** First 160 chars of description
-   **Open Graph:** og:image, og:type, og:url

### URL Structure

-   Gallery: `/`
-   Build: `/builds/{slug}`
-   Support: `/support`
-   Admin: `/admin`

---

## 8. Storage Management

### Supabase Free Tier

-   **Total Storage:** 1GB
-   **Target Usage:** ~240MB for 200 builds
-   **Dashboard Display:** Progress bar showing usage
-   **Warning:** Alert at 80% (800MB)

---

## 9. Error Handling

### Upload Failures

-   Toast notification: "Upload failed, please try again"
-   Allow retry without losing form data

### Authentication

-   Failed login: Error message below form
-   Session expired: Redirect with message

### Form Validation

-   Client-side HTML5 validation
-   Title: 3-100 characters
-   Piece count: Positive integer
-   Dates: Start before completion

### 404 Errors

-   Custom 404 page with link back to gallery

---

## 10. Security

### Supabase RLS

-   Public: View published posts and images only
-   Authenticated: Full access to all posts and images

### File Upload Security

-   Validate MIME type and file size on client
-   Re-validate on server
-   Only authenticated users can upload

### Environment Variables

-   **Client (NEXT*PUBLIC*):**
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-   **Server only:**
    -   `SUPABASE_SERVICE_ROLE_KEY`
    -   `BTC_ADDRESS`, `ETH_ADDRESS`, `SOL_ADDRESS`

---

## 11. Deployment

### Hosting

-   **Platform:** Vercel (free tier)
-   **Auto Deploy:** Push to `main` branch
-   **Preview:** Feature branches get preview URLs

### Branch Strategy

-   `main`: Production
-   `dev`: Development/staging
-   `feature/*`: Individual features

---

## 12. Out of Scope (V1)

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

---

## 13. Project Structure

```
mybrickscreations/
├── app/
│   ├── page.tsx                  # Home/Gallery
│   ├── builds/
│   │   └── [slug]/
│   │       └── page.tsx          # Build detail
│   ├── support/
│   │   └── page.tsx              # Donation page
│   ├── admin/
│   │   ├── layout.tsx            # Protected layout
│   │   ├── page.tsx              # Dashboard
│   │   └── posts/
│   │       ├── page.tsx          # Post manager
│   │       ├── new/
│   │       │   └── page.tsx      # Create post
│   │       └── edit/[id]/
│   │           └── page.tsx      # Edit post
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── BuildCard.tsx             # Gallery card
│   ├── ImageCarousel.tsx         # Image viewer
│   ├── AdminNav.tsx              # Admin nav
│   └── ui/                       # Reusable components
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   └── utils.ts                  # Utilities
├── supabase/
│   └── migrations/               # SQL scripts
├── public/
│   ├── qr-codes/                 # QR images
│   └── avatar.jpg                # Profile image
├── .env.local                    # Environment variables
├── .gitignore
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

**Document Version:** 1.0  
**Created:** December 2025  
**Last Updated:** N/A  
**Creator:** Marcelo Romero
