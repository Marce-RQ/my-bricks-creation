# My Bricks Creations

## QA Focus and Test Automation

This website was built with AI assistance, leaning into vibe coding for rapid UI development. The end-to-end QA automation framework was designed separately from a QA engineer’s perspective, with a manually implemented Page Object Model (POM).

- **Approach**
  - QA-first mindset: features were explored and validated via automated tests.
  - Website development using Windsurf (vibecoding); the QA framework and Page Object Model (POM) were implemented deliberately and manually.
  - Deployed to Vercel for quick preview/production validation.

## Test Automation Overview (Playwright)

```
my-bricks-creation/
├── playwright.config.js # Playwright configuration
├── tests/
│   ├── config/
│   │   └── env.js # Environment URLs
│   ├── pages/ # Page Object Model: Locators and Actions
│   │   ├── admin/
│   │   │   └── AdminLogin.page.js
│   │   └── user/
│   │       ├── Build.page.js
│   │       └── MainPage.page.js
│   └── specs/ # Test suites
│       ├── admin/
│       │   └── adminLogin.spec.js
│       └── user/
│           ├── buildPageExploration.spec.js
│           └── landingSiteExploration.spec.js
└── package.json # Dependencies
```

- **Key Scenarios Covered**
  - Admin login: page load (EN/ES), valid/invalid credentials, empty submit, email case-insensitivity, password case-sensitivity, toast notifications, dashboard visibility.
  - User landing: header brand navigation, language switcher (EN/ES), gallery link scroll, My Story link, counters visibility, featured build image load, Support link.
  - Build page: image visibility and carousel next/prev, build details (title, dates, pieces, story), Support and Back to Gallery links.

> **Note:** Tests are not completed; more scenarios for the Admin site will be added in the future.
  

## Running the Tests
The tests are designed to run against the local development server by default. To run them:

1) Install dependencies

```bash
npm install
```

2) Set environment variables for admin login tests (used by `adminLogin.spec.js`)

```bash
export ADMIN_EMAIL="your-admin-email@example.com"
export ADMIN_PASSWORD="your-strong-password"
```

3) Run the full Playwright test suite

```bash
npx playwright test
```

Optional:

- Run in headed mode

```bash
npx playwright test --headed
```

- Open the HTML report after a run

```bash
npx playwright show-report
```

Notes:

- Tests default to run against the local dev server as configured in `playwright.config.js`.
- To target production manually, update `use.baseURL` in `playwright.config.js` (see `tests/config/env.js` for URLs) and re-run.

## Deployment

- Hosted on Vercel. Production URL used in tests config: `https://my-bricks-creations.vercel.app`.
```
```
---


# Developers Guide 
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- PostCSS
- next/font (Geist)
- react-hot-toast
- Supabase (Auth, DB, Storage)
- dotenv
- next-intl (i18n)
- react-dropzone
- Playwright (E2E tests)
- Page Object Model
- ESLint
- Prettier
- Windsurf (AI-assisted IDE)
- Vercel (hosting)
- npm/yarn/pnpm/bun

## Additional Developer Info

- **Environment Setup**
  - Copy `.env.example` to `.env.local` and set:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `ADMIN_EMAIL`
    - `ADMIN_PASSWORD`
- **Scripts**
  - `npm run dev` – start dev server
  - `npm run build` – build for production
  - `npm start` – start production server
  - `npm run lint` – lint code
  - `npx playwright test` – run E2E tests
- **Prerequisites**
  - Node.js (check `.nvmrc` or `package.json` engines)
  - `npx playwright install` – install Playwright browsers
- **Project Structure**
  - `app/` – Next.js App Router pages and API
  - `components/` – React components
  - `lib/` – utilities, Supabase client, types
  - `tests/` – Playwright specs and page objects
  - `supabase/migrations/` – DB schema
- **Running Tests**
  - Export admin credentials:
    ```bash
    export ADMIN_EMAIL="your-admin@example.com"
    export ADMIN_PASSWORD="your-password"
    npx playwright test
    ```
- **Linting/Formatting**
  - `npm run lint`
  - `npm run format` (if added)
- **Deployment**
  - Set environment variables in Vercel dashboard
- **Database**
  - Apply migrations via Supabase dashboard or CLI
- **Contributing**
  - Feature branches, PRs, and code reviews expected

