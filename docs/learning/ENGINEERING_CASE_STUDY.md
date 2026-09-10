# Engineering Achievement Report

## Senior Frontend Engineer Perspective

This report documents the engineering work represented across the workspace repositories. I approached these systems as a Senior Frontend Engineer: clarifying product workflows, choosing maintainable boundaries, protecting user data, and treating performance, resilience, and operational visibility as part of the feature rather than afterthoughts.

The portfolio demonstrates progression from focused state-management and language exercises to production-oriented web, mobile, admin, and realtime applications. The report distinguishes implemented behavior from documented roadmap items and records important residual risks honestly.

## Capability Summary

| System | Primary achievement | Core architecture |
| --- | --- | --- |
| Smart Grocery mobile | Offline-capable grocery planning and shopping workflow | Expo/React Native, Context, Firebase, AsyncStorage |
| Smart Grocery admin | Protected operational console | Vite/React, Redux Toolkit, MUI, Firebase |
| Smart Grocery website | SEO-ready product and acquisition surface | Vite/React, React Router, CSS |
| Live Cricket Scoreboard | Realtime match operations and scorekeeping | React/Vite, Redux Toolkit, Express, Prisma/PostgreSQL, Firebase Auth |
| NitCrafted website | Fast, animated multi-page company site | React/Vite, React Router, lazy routes, Framer Motion |
| Portfolio site | Content-managed personal brand platform | React/Vite, Firebase, Lexical, Markdown, Express/Multer |
| Redux demonstration | Clear feature-slice state architecture | React/Vite, Redux Toolkit |
| TypeScript and Jest exercises | Foundations for typed implementation and testing | TypeScript, Jest |

---

## 1. Smart Grocery Mobile: Grocery Planning and Shopping Lifecycle

### Problem

Grocery planning is fragmented when users must remember recurring purchases, rebuild lists every week, and track spending separately from the act of shopping. A mobile workflow also has to remain useful when connectivity is unreliable and must prevent incomplete or misleading shopping records.

### Solution

I built a domain-oriented React Native application covering grocery CRUD, active shopping sessions, quantities and units, bought state, history, price tracking, recurring items, analytics, notifications, and profile/settings flows. The shopping lifecycle enforces meaningful business rules: sessions cannot be completed while empty or while items remain unbought.

### Architecture

Expo and React Native compose the application. Root providers separate authentication, settings, theme, network state, groceries, shopping, recurring items, smart-recurring insights, and notifications. Firebase Auth and Firestore provide the persisted user-scoped model:

```text
users/{uid}
  settings/main
  groceries/{groceryId}
  recurringItems/{recurringId}
  shoppingSessions/{sessionId}
  shoppingItems/{shoppingItemId}
```

Navigation is state-gated through authentication, email verification, onboarding completion, and the authenticated app stack. Domain contexts expose hooks to screens and shared components.

### Technical decisions

- React Context was chosen for bounded domain state and dependency-light composition; this repository does not use Redux Toolkit.
- Shopping items store a snapshot of grocery details so historical sessions remain understandable after the master grocery changes.
- Quantity increments are derived from unit type, such as grams, millilitres, or count, instead of hard-coded into individual screens.
- Server timestamps and normalization helpers reduce inconsistent Firestore records.
- Shared rows, pickers, quantity controls, skeletons, banners, and notification APIs keep screen code focused on workflows.

### Packages used

Expo SDK 54, React 19, React Native 0.81, React Navigation 7, Firebase 12, AsyncStorage, NetInfo, Expo Notifications, Expo Image Picker, React Native Reanimated, React Native Gifted Charts, Jest, React Native Testing Library, and Detox configuration.

### Challenges solved

- Coordinating multiple state domains without coupling every screen to a global store.
- Preserving useful cached data while Firestore listeners hydrate and reconcile remote state.
- Handling recurring purchases, skipped dates, daily cost calculations, and smart cadence inference.
- Supporting notification taps that navigate into the correct screen.
- Making premium Smart Scan fit the existing grocery workflow without exposing model credentials.

### Performance considerations

AsyncStorage enables fast offline reads, while optimistic updates keep interactions responsive. Firestore listeners provide realtime synchronization. Skeleton states reduce perceived latency, and charts consume already-shaped domain data. Notification scheduling includes deduplication and cancellation to avoid unnecessary work and duplicate reminders.

### Security considerations

Authentication uses Firebase persistence, sensitive account actions require reauthentication, and all product data is modeled beneath the authenticated user. Environment values are validated per build variant. Smart Scan is premium-gated and its callable function validates authentication, MIME type, and image size before using a server-side Firebase secret. Firestore rules are a critical deployment requirement: the repository documents the policy, but no rules file was found, so rule enforcement must be verified before production exposure.

---

## 2. Smart Grocery Mobile: Smart Scan and Assisted Entry

### Problem

Manually entering grocery items is repetitive, especially when a user is converting a physical list or receipt-like image into structured items. AI assistance must be useful without allowing untrusted image input or leaking provider credentials to the client.

### Solution

The app captures an image, converts it to a bounded payload, calls the `scanGroceryItem` Firebase callable function, and returns a result for user confirmation before it becomes grocery data. The feature is separated into a client service and a backend function rather than embedding AI calls in the UI.

### Architecture

React Native image selection feeds `smart-scan.service.js`. The callable Cloud Function in `functions/index.js` is the trust boundary: it authenticates the caller, validates input, applies premium access rules, and calls OpenAI with a Firebase-managed secret.

### Technical decisions

- Callable Functions provide a server-mediated API with Firebase identity context.
- Confirmation remains in the user workflow, avoiding silent creation from model output.
- Payload validation is performed at the boundary rather than trusting client-generated metadata.
- The feature is isolated so the grocery domain does not depend directly on the AI provider.

### Packages used

Expo Image Picker, Expo File System, Firebase Functions, Firebase Auth, and the OpenAI integration used by the Cloud Function.

### Challenges solved

The implementation handles the platform image path, base64 conversion, asynchronous server response, premium gating, and graceful failure without turning a model response into an unchecked database mutation.

### Performance considerations

Image size and MIME checks bound request cost and latency. The client sends one explicit request and keeps the expensive provider call off the device. The confirmation step also prevents repeated accidental writes.

### Security considerations

The OpenAI secret stays on the server. The function requires an authenticated user, rejects unsupported or oversized images, and must retain least-privilege Firestore and callable-function rules. Raw image contents should not be logged or included in analytics.

---

## 3. Smart Grocery Admin: Protected Operations Console

### Problem

A consumer product needs a separate operational surface for managing users, categories, configuration, and product health. Administrative access cannot be treated as ordinary navigation, and large tables need predictable loading and validation behavior.

### Solution

I structured a separate Vite React admin application with login, protected routes, dashboard metrics, user management, category management, settings, responsive navigation, loading states, and runtime error handling.

### Architecture

`App.jsx` observes Firebase Auth. `ProtectedRoute` gates private routes, while a dashboard layout owns the authenticated shell. Redux Toolkit stores async feature state; service modules isolate Firebase Auth and Firestore access from pages. MUI supplies the design system and Data Grid supports operational tables. Routes are lazy-loaded.

### Technical decisions

- Service boundaries prevent Firestore details from spreading through page components.
- Redux Toolkit async thunks make loading, success, and failure states explicit.
- Zod and React Hook Form validate input at the form boundary.
- MUI provides accessible, responsive primitives and a consistent theme.
- Recharts is used for dashboard visualization, with placeholder analytics explicitly labeled rather than presented as real telemetry.

### Packages used

React, Vite, React Router, Firebase, Redux Toolkit, React Redux, MUI, MUI X Data Grid, Emotion, React Hook Form, Zod, Recharts, Lucide React, and ESLint.

### Challenges solved

- Separating authenticated admin routing from public site routing.
- Verifying that a Firebase-authenticated identity is actually present in the `admins/{uid}` collection.
- Representing remote loading and failure states in a reusable dashboard shell.
- Supporting responsive navigation without duplicating route logic.

### Performance considerations

Lazy routes reduce the initial admin bundle. Redux status flags avoid repeated loads while a slice is active. Data grids and bounded Firestore queries are the correct direction for operational scale; routine analytics should consume backend aggregates rather than scan every user document.

### Security considerations

Unauthorized Firebase users are signed out, admin identity is checked before protected content is exposed, and environment variables are validated. The next security requirement is versioned Firestore rules with explicit roles, audit records, and least-privilege access. The current admin model should not be treated as a substitute for server-enforced rules.

---

## 4. Smart Grocery Website: Product, SEO, and Grocery Demo Experience

### Problem

The product needs a discoverable public surface that explains the value of the mobile app, supports legal/account workflows, and demonstrates grocery interactions without making visitors navigate an internal admin or mobile build.

### Solution

The public Vite React app provides landing, terms, privacy, account deletion, contact, FAQ, product screenshots, download calls to action, and a reusable grocery demo. The demo supports item entry, quantity and category selection, suggestions, bought/to-buy filters, category grouping, pagination, and optional automatic loading.

### Architecture

React Router composes public pages. Reusable grocery components own input, list, and item behavior. Hooks provide local-storage persistence and debouncing. `SeoMetadata` centralizes document title, social metadata, canonical information, and JSON-LD. Static crawler assets live in `public/`.

### Technical decisions

- Local storage keeps the demo useful without an account or backend.
- Debounced history suggestions prevent an expensive update for every keystroke.
- IntersectionObserver is used for optional progressive list loading.
- Product/company metadata is centralized in `company.json` to prevent brand and SEO drift.
- Plain CSS, MUI/Emotion, and icon packages are used rather than introducing Tailwind into this repository.

### Packages used

React, React DOM, Vite, React Router, MUI, Emotion, MUI icons, React Icons, and ESLint.

### Challenges solved

The site combines marketing content, utility pages, and an interactive product demonstration while preserving a simple public route tree. Touch-friendly screenshot presentation and structured metadata extend the experience beyond desktop-only browsing.

### Performance considerations

Debouncing, pagination, optional observer-driven loading, static assets, and Vite’s production bundling reduce unnecessary browser work. The screenshot carousel advances on an interval and supports touch gestures without requiring a heavy carousel dependency.

### Security considerations

The public demo keeps data local and does not require credentials. The account-deletion page makes the privacy workflow discoverable. Because this repository has no application tests or backend implementation, production validation of form handling, CSP, and deployment headers remains an operational follow-up.

---

## 5. Live Cricket Scoreboard: Realtime Match Operations

### Problem

Cricket scoring is stateful and time-sensitive. A scoreboard must represent innings, overs, batsmen, bowlers, wickets, partnerships, winners, and match history while multiple views and administrators depend on consistent updates.

### Solution

I developed a public scoreboard and authenticated administration workflow for series, matches, teams, players, announcements, profiles, scorecards, history, and live score updates. The system supports both operational editing and public consumption.

### Architecture

The frontend uses React/Vite, Redux Toolkit, React Router, and Firebase services. An Express 5 API provides server operations backed by Prisma and PostgreSQL. Prisma models cover users, series, matches, teams, players, match-team relations, events, scoreboards, batting, and bowling statistics. Firebase bearer tokens authenticate API requests where middleware is applied.

### Technical decisions

- PostgreSQL is used for relational match data and transactional updates.
- Prisma provides a typed schema and migration workflow around the relational model.
- Redux Toolkit centralizes complex scoreboard state and async coordination.
- Stale-update conflict detection protects live editing from overwriting newer state.
- Allowed-field filtering limits mutation payloads to known fields.
- Firebase Auth is retained for identity while the API owns relational domain writes.

### Packages used

React, Vite, Redux Toolkit, React Redux, React Router, Express, Prisma, PostgreSQL client, Firebase, Firebase Admin, CORS, Cuid, ExcelJS, Tailwind CSS, Lucide React, React Icons, and Concurrently.

### Challenges solved

The implementation reconciles event-level scoring with derived scorecards, manages innings and over transitions, handles player/team relationships, and supports public and administrative views over the same match lifecycle. Abort controllers and stale-response suppression reduce race conditions during rapid navigation or live refreshes.

### Performance considerations

API reads are paginated and live requests are debounced or cancelled when obsolete. Independent requests can settle with `Promise.allSettled`, allowing partial views to render without blocking on an unrelated failure. Database indexes and bounded queries are essential as match history grows.

### Security considerations

Firebase bearer-token verification, creator/admin authorization, field filtering, and transactional writes are strong foundations. However, repository analysis identified match mutation routes that are not consistently protected by token middleware and unrestricted CORS. Those are release-blocking issues for a production deployment, alongside the need for automated authorization tests and documented API contracts.

---

## 6. NitCrafted Website: Responsive Company Experience

### Problem

A company website needs multiple content pages, consistent navigation, discoverability, motion, and fast first render without turning every route into a monolithic bundle.

### Solution

The NitCrafted site provides Home, Products, About, Contact, Privacy, Terms, and Not Found pages with a shared root layout, reusable components, responsive navigation, animated transitions, centralized SEO/company data, and operational telemetry.

### Architecture

React Router owns route composition and the root layout. Pages are lazy-loaded behind `Suspense`, while scroll-to-top behavior and shared header/footer concerns stay at the layout level. SEO metadata, sitemap, robots file, and manifest are maintained as explicit site infrastructure.

### Technical decisions

- Route-level code splitting limits the initial JavaScript payload.
- Framer Motion provides intentional page and content transitions.
- Lucide icons avoid custom icon maintenance and improve consistency.
- A skip-to-content link establishes a basic keyboard accessibility path.
- Vercel Analytics and Speed Insights provide production visibility.

### Packages used

React, Vite, React Router, Framer Motion, Lucide React, Vercel Analytics, Vercel Speed Insights, Tailwind CSS, PostCSS, and ESLint.

### Challenges solved

Shared layout composition avoids duplicated navigation logic while preserving separate page experiences. The site balances visual motion with route loading, responsive constraints, and conventional crawler metadata.

### Performance considerations

Lazy routes, Vite bundling, static assets, and route-level suspense reduce initial work. Speed Insights provides a feedback loop for real-user performance rather than relying only on local development measurements.

### Security considerations

The site is primarily public and keeps privileged behavior out of the public route layer. Forms and any future server actions should still validate input and protect submission endpoints. No automated tests were found, so accessibility and responsive regression coverage should be added as the site evolves.

---

## 7. Portfolio Site: Content Management and Publishing Workflow

### Problem

A developer portfolio needs more than static project cards: it must support structured case studies, blog publishing, analytics, media uploads, and protected authoring without compromising the public reading experience.

### Solution

The portfolio site combines responsive public sections, dark mode, project case studies, blog/travel content, analytics, and a protected admin area for dashboards, projects, settings, notes, and blog creation. A rich editor and sanitized Markdown pipeline support authoring and safe rendering.

### Architecture

React/Vite composes the public and admin route trees. Firebase Auth and Firestore provide identity and content persistence. Lexical handles rich text editing, Markdown/GFM rendering presents content, and a separate Express/Multer backend handles uploads.

### Technical decisions

- Lexical separates rich editing behavior from page rendering.
- `rehype-sanitize` is used when rendering Markdown/GFM to reduce XSS risk.
- Recharts supports admin analytics visualization.
- Firebase reCAPTCHA and protected admin routing add abuse and access controls.
- Upload processing is kept in a separate backend so media concerns do not inflate the browser bundle.

### Packages used

React, Vite, Firebase, React Router, Redux-related state tooling, Lexical, Markdown/GFM tooling, `rehype-sanitize`, Recharts, Swiper, Express, Multer, and reCAPTCHA integration.

### Challenges solved

The system joins public content delivery with privileged authoring, rich text, images, project metadata, and analytics. It also supports responsive presentation and theme changes without forcing the authoring model onto every public component.

### Performance considerations

Swiper manages screenshot/media interaction, and the separation of upload handling avoids sending file-processing logic through the client. Content should continue to use bounded queries and image size constraints as the archive grows.

### Security considerations

Protected admin routes, validation, sanitized Markdown, Firebase Auth, and reCAPTCHA address key threats. Two backend hardening issues remain visible in the repository: unrestricted CORS and preservation of original upload filenames. Uploads should use generated safe names, validated content types, size limits, and a narrowly scoped origin policy.

---

## 8. Redux Feature-Slice Architecture Demonstration

### Problem

As frontend applications grow, ad hoc component state makes shared behavior difficult to reason about and test. A small, explicit example is useful for demonstrating predictable state transitions before applying the pattern to larger products.

### Solution

The React/Vite demonstration implements a counter and a to-do list using Redux Toolkit slices. It supports increment, decrement, reset, arbitrary increment, add, and delete operations.

### Architecture

`src/store/store.js` configures the Redux store. Feature folders own their slice and UI: `counter/` and `toDoApp/`. React Redux provides the store boundary and component bindings.

### Technical decisions

- Feature folders keep reducers and UI close to the behavior they represent.
- Redux Toolkit reduces boilerplate and standardizes immutable update patterns.
- Actions describe user intent, making state transitions inspectable.
- The example remains intentionally small and does not pretend to solve persistence or server synchronization.

### Packages used

React, React DOM, Redux Toolkit, React Redux, Vite, and ESLint.

### Challenges solved

The project demonstrates the complete state path from dispatch to reducer to rendered state, including multiple independent domains in one store.

### Performance considerations

The state surface is small, so performance concerns are limited. The important transferable decision is to keep slices focused so unrelated updates do not force broad component coupling.

### Security considerations

There is no authentication, persistence, or backend. The main security lesson is scope control: this client-only example does not claim to protect or store sensitive data.

---

## 9. TypeScript Foundations and Jest Testing Foundations

### Problem

Strong frontend delivery depends on two disciplines: making data contracts explicit and verifying behavior with repeatable tests. These repositories capture the early practice needed to apply both disciplines in larger systems.

### Solution

`project_typescript` contrasts typed TypeScript primitives, arrays, objects, and assignments with an untyped JavaScript equivalent. `getting-started-with-jest` establishes a CommonJS Jest 30 project using the Node test environment.

### Architecture

The TypeScript project is a minimal language exercise centered on `Basics.ts`; it does not yet include a framework, build configuration, or runtime application. The Jest project is a minimal package-level test harness with an `npm test` script.

### Technical decisions

- The contrast between typed and untyped functions makes the value of explicit contracts concrete.
- Jest is configured with a Node environment appropriate for pure JavaScript tests.
- The minimal setup keeps tool behavior visible before introducing application abstractions.

### Packages used

TypeScript and Jest 30.

### Challenges solved

These exercises establish vocabulary for type errors, test discovery, assertions, and test-environment configuration. They also provide a baseline for scaling into the tested mobile and operational applications.

### Performance considerations

The projects are intentionally tiny, so runtime optimization is not a meaningful concern. Fast feedback is the primary performance goal: a small compile/test loop supports iterative development.

### Security considerations

No production data or service credentials are present. The Jest starter contains no implemented test cases, and the TypeScript project’s test script intentionally exits with an error; they should be described as foundations rather than production quality gates.

---

## Cross-Repository Engineering Decisions

### State management

The workspace demonstrates choosing state tools according to product shape rather than applying one library everywhere. React Context fits the mobile domain-provider model, Redux Toolkit fits the admin and scoreboard’s coordinated async state, and local component state is sufficient for the public grocery demo.

### Backend boundaries

Firebase is effective for authentication, realtime user-scoped documents, and callable functions. The cricket scoreboard demonstrates a complementary relational approach where transactional, relational match data benefits from Express, Prisma, and PostgreSQL. The boundary should remain explicit: identity, authorization, and domain persistence must not be assumed interchangeable.

### Resilience

Offline caching, optimistic updates, loading skeletons, request cancellation, stale-response suppression, and error boundaries show a consistent focus on keeping interfaces usable under imperfect conditions. These patterns are especially valuable in mobile shopping and live scoring workflows.

### Security posture

The strongest implemented patterns are user-scoped data, authenticated admin checks, reauthentication for sensitive account actions, server-side secrets, input validation, sanitized Markdown, and bearer-token middleware. The most important hardening items are explicit Firestore rules, complete API route protection, restrictive CORS, safe upload naming, content-size/type limits, audit logging, and automated security tests.

### Performance posture

The portfolio uses lazy routes, Vite production builds, debouncing, pagination, observers, caching, optimistic rendering, request cancellation, and bounded queries. The next maturity step is measurement-driven optimization: bundle budgets, real-user performance, Firestore read monitoring, API latency dashboards, and mobile startup profiling.

## Closing Assessment

The repositories show a broad Senior Frontend Engineer profile: product thinking across acquisition and core workflows, mobile-first resilience, structured admin tooling, realtime domain modeling, reusable UI architecture, and an awareness of security and operational tradeoffs. The highest-value next step is not another isolated feature; it is consolidating contracts across the Smart Grocery web, admin, and mobile clients, then enforcing those contracts through shared validation, versioned security rules, aggregate analytics, and automated integration tests.
