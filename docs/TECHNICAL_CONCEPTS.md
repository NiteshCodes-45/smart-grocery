# Smart Grocery Admin Dashboard Design

## Purpose

This document defines the phased design for turning the existing Smart Grocery admin application into the central management portal for the mobile product.

This is a design and implementation-phasing document only. It intentionally contains no implementation code and does not prescribe immediate source changes.

## Current Baseline

The admin application currently provides:

- Firebase Email/Password authentication.
- Firestore-backed admin authorization through `admins/{uid}`.
- User listing from the top-level `users` collection.
- Category listing and editing through the top-level `categories` collection.
- A dashboard with user/category counts.
- Placeholder session metrics and placeholder weekly chart data.
- MUI layout, Redux Toolkit state, lazy routes, and responsive navigation.

Primary references:

- [admin/src/pages/Dashboard/DashboardPage.jsx](../admin/src/pages/Dashboard/DashboardPage.jsx)
- [admin/src/routes/AppRoutes.jsx](../admin/src/routes/AppRoutes.jsx)
- [admin/src/layouts/DashboardLayout.jsx](../admin/src/layouts/DashboardLayout.jsx)
- [admin/src/services/authService.js](../admin/src/services/authService.js)
- [admin/src/services/userService.js](../admin/src/services/userService.js)
- [admin/src/services/categoryService.js](../admin/src/services/categoryService.js)
- [admin/src/app/store.js](../admin/src/app/store.js)

The mobile application currently owns authenticated user data below `users/{uid}` and uses realtime Firestore listeners, AsyncStorage caching, local notifications, and a callable Smart Scan function.

Primary mobile references:

- [smart-grocery-app/firebase/firebaseConfig.js](../../smart-grocery-app/firebase/firebaseConfig.js)
- [smart-grocery-app/store/auth-context.js](../../smart-grocery-app/store/auth-context.js)
- [smart-grocery-app/grocery/grocery.service.js](../../smart-grocery-app/grocery/grocery.service.js)
- [smart-grocery-app/store/shopping-context.js](../../smart-grocery-app/store/shopping-context.js)
- [smart-grocery-app/utils/notification.service.js](../../smart-grocery-app/utils/notification.service.js)
- [smart-grocery-app/functions/index.js](../../smart-grocery-app/functions/index.js)

## Target Operating Model

```text
Mobile application
  -> Firebase Auth
  -> Firestore user/domain data
  -> Analytics event pipeline
  -> Crash reporting pipeline
  -> Push token and delivery services
  -> Remote Config
  -> Feedback submission

Firebase backend
  -> Security Rules
  -> Cloud Functions
  -> Scheduled aggregation jobs
  -> Admin-only aggregate collections
  -> Audit records

Admin Dashboard
  -> Firebase Auth with admin role
  -> Read-only aggregate analytics by default
  -> Controlled operational writes
  -> Audit trail for every privileged action
```

The dashboard should not read every user's complete grocery, session, or item history for routine charts. The mobile app and backend should produce bounded aggregates, while the admin consumes those aggregates according to role permissions.

## Phase 1: Security and Data Governance Foundation

### Objective

Establish the security, ownership, naming, and audit foundations required before exposing operational data to administrators.

### Scope

- Define admin roles such as `super_admin`, `operator`, `support`, and `analyst`.
- Define which roles may read users, analytics, crashes, feedback, notifications, and configuration.
- Version Firestore security rules and indexes.
- Enforce ownership for mobile documents under `users/{uid}`.
- Restrict global collections such as `admins`, `categories`, `feedback`, and `remoteConfig`.
- Define whether admin access uses custom claims, admin documents, or both.
- Add audit records for category edits, remote configuration changes, push sends, and account actions.
- Define data retention periods for events, crashes, feedback, and notification logs.
- Establish a canonical schema for user, grocery, shopping session, recurring item, and event fields.

### Secure Communication Model

The mobile application should communicate with Firebase using its authenticated Firebase user session. Client Firebase configuration values are not secrets; authorization must come from Firebase Authentication, Firestore Rules, App Check where supported, and server-side Cloud Functions.

The admin dashboard should authenticate through Firebase Auth and verify its admin role before loading any protected route. The dashboard should consume aggregate documents and callable/server-mediated operations rather than bypassing authorization through broad client queries.

### Exit Criteria

- Rules are tested in the Firebase Emulator.
- Every protected collection has an explicit owner or role policy.
- Admin permissions are documented and represented in security rules.
- Audit events are defined for privileged operations.
- Data retention and deletion responsibilities are approved.

## Phase 2: Analytics and Dashboard KPI Foundation

### Objective

Replace placeholder dashboard statistics with trustworthy product and operational KPIs.

### Mobile Event Contract

The mobile application should emit privacy-conscious events for meaningful product actions, not raw personal grocery contents. Suggested event families include:

- `app_opened`
- `session_started`
- `session_completed`
- `grocery_created`
- `grocery_updated`
- `grocery_deleted`
- `grocery_checked`
- `recurring_item_created`
- `recurring_item_skipped`
- `smart_scan_completed`
- `notification_opened`
- `feedback_submitted`
- `onboarding_completed`

Events should contain bounded metadata such as app version, platform, environment, locale, and coarse feature identifiers. They should not contain passwords, image payloads, unrestricted grocery names, or unnecessary personal data.

### Data Flow

1. The mobile app authenticates with Firebase.
2. The mobile client records approved analytics events through the selected analytics layer.
3. Backend jobs aggregate daily and weekly metrics.
4. Aggregates are written to admin-readable collections.
5. The dashboard reads only the required date ranges and metric documents.

### Dashboard KPIs

The first KPI layer should include:

- Total registered users.
- New users today, this week, and this month.
- Daily active users.
- Weekly active users.
- Monthly active users.
- Onboarding completion rate.
- Email verification rate.
- Active shopping sessions.
- Completed shopping sessions.
- Session completion rate.
- Average items per session.
- Average session spend.
- Grocery items created per active user.
- Recurring-item adoption.
- Smart Scan usage.
- Current app version distribution.
- Crash-free users and sessions once Crashlytics is available.

### Dashboard Presentation

The dashboard should provide:

- KPI cards with current value, comparison period, and trend direction.
- Date range selector.
- Platform and app-version filters.
- Empty, delayed, and stale-data states.
- Last aggregation timestamp.
- Links from KPI cards to deeper analytics pages.

### Exit Criteria

- Placeholder `SESSION_CHART_DATA` is removed from the product plan.
- KPI definitions are approved and documented.
- Aggregation freshness and failure states are visible.
- Dashboard values can be reconciled against source events.

## Phase 3: Shopping Analytics

### Objective

Provide operational insight into how users plan, shop, complete sessions, and manage spending.

### Mobile Data Sources

The mobile application already stores shopping data under user-scoped collections:

- `shoppingSessions`
- `shoppingItems`
- `groceries`
- `recurringItems`

The existing shopping workflow validates that sessions are non-empty and all items are bought before completion in [smart-grocery-app/store/shopping-context.js](../../smart-grocery-app/store/shopping-context.js).

### Analytics Views

The admin should eventually support:

- Sessions started versus completed.
- Abandoned or long-running sessions.
- Average session duration.
- Average session item count.
- Average spend per session.
- Bought versus unbought item ratios.
- Most frequently purchased categories.
- Most frequently recurring categories.
- Price trend summaries by category.
- Usage of quantity and unit types.
- Shopping behavior by app version and platform.

### Privacy Boundary

The default dashboard should use category-level and aggregate data. Individual grocery names, personal spending history, or user-level shopping records should require a support-level permission and a justified workflow.

### Exit Criteria

- Session aggregates are produced by date and platform.
- Historical queries are bounded and indexed.
- Sensitive user-level drill-down is permission-controlled.
- Dashboard charts show data freshness and source scope.

## Phase 4: Crashlytics and Reliability Operations

### Objective

Give administrators a reliable view of crashes, affected releases, and app health.

### Current Gap

The mobile package currently does not show a Crashlytics dependency or Crashlytics integration. The admin dashboard has an error boundary, but that only handles web admin render failures and is not a mobile crash reporting system.

Relevant current references:

- [smart-grocery/admin/src/components/ErrorBoundary/ErrorBoundary.jsx](../admin/src/components/ErrorBoundary/ErrorBoundary.jsx)
- [smart-grocery-app/package.json](../../smart-grocery-app/package.json)
- [smart-grocery-app/ErrorBoundary.js](../../smart-grocery-app/ErrorBoundary.js)

### Mobile Crash Reporting Design

The mobile app should:

- Integrate a supported Firebase Crashlytics package compatible with its Expo/native build strategy.
- Record fatal and non-fatal exceptions.
- Attach non-sensitive keys such as app version, build number, platform, environment, and feature area.
- Avoid logging passwords, tokens, full user profiles, raw grocery contents, or image payloads.
- Record breadcrumbs around important workflows such as session completion and Smart Scan.
- Distinguish development, preview, and production reporting environments.

### Admin Reliability Views

Crashlytics data should be consumed through its supported reporting/export mechanism, not by pretending raw Crashlytics data is ordinary Firestore data. The admin portal should show:

- Crash-free users.
- Crash-free sessions.
- Crash-free rate by release.
- Top crash groups.
- First-seen and last-seen times.
- Affected app versions.
- Affected platforms.
- Regression status.
- Release health trend.

### Exit Criteria

- Production mobile crashes are visible in the chosen reporting system.
- Crash data is separated by release and environment.
- PII redaction rules are tested.
- Admin users can see health summaries without receiving raw sensitive logs.

## Phase 5: User Management and Support Operations

### Objective

Turn the existing users page into a secure support and account-management workspace.

### Current Baseline

The existing users page loads user documents into Redux and filters them locally. References:

- [admin/src/pages/Users/UsersPage.jsx](../admin/src/pages/Users/UsersPage.jsx)
- [admin/src/features/users/userSlice.js](../admin/src/features/users/userSlice.js)
- [admin/src/services/userService.js](../admin/src/services/userService.js)

### Target Capabilities

- Search by normalized email or user ID.
- Paginated user list.
- Account status and verification status.
- App version and last-seen information.
- Premium entitlement state.
- Onboarding completion state.
- Aggregate usage summary.
- Support notes with audit history.
- Account disable/restore workflow.
- Account deletion request tracking.
- Reauthentication requirements for sensitive operations.

### Security Boundary

The dashboard should not expose passwords, authentication tokens, private notification data, or unrestricted user-owned grocery contents. User details should be minimized by role.

Account deletion should be handled by a backend workflow with job status, retries, and audit records rather than a browser deleting multiple Firestore collections directly.

### Exit Criteria

- User list uses bounded queries.
- Sensitive actions require explicit permission and confirmation.
- Every mutation creates an audit record.
- Support users receive the minimum data required for their work.

## Phase 6: Feature Usage and Product Intelligence

### Objective

Measure adoption and retention of the mobile product features.

### Feature Areas

The dashboard should track:

- Onboarding completion.
- Grocery list creation.
- Category usage.
- Shopping session creation.
- Shopping session completion.
- Recurring-item creation and skip behavior.
- History and analytics screen usage.
- Smart Scan attempts and successful results.
- Notification permission acceptance.
- Notification opens.
- Theme, currency, or settings usage where appropriate.

### Analysis Views

- Feature adoption funnel.
- Weekly active feature users.
- Feature retention after seven and thirty days.
- Conversion from onboarding to first grocery item.
- Conversion from first list to completed shopping session.
- Smart Scan success and failure rate.
- Feature usage by app version.
- Feature usage by platform and environment.

### Data Rules

Feature analytics should use event names and coarse metadata. Raw user content should not be used as an analytics dimension unless explicitly justified, minimized, and approved.

### Exit Criteria

- Every tracked feature has a documented event definition.
- Events have versioned schemas.
- Adoption metrics can be segmented by release.
- Analytics collection can be disabled or sampled by environment.

## Phase 7: Feedback Management

### Objective

Create a structured feedback loop between mobile users and the Smart Grocery team.

### Mobile Submission Flow

The mobile app should be able to submit:

- Feedback category.
- Rating.
- Message.
- Optional diagnostic context.
- App version.
- Platform.
- User ID reference.
- Created timestamp.
- Consent for follow-up.

The mobile app should not attach raw crash logs, auth credentials, or unrestricted local storage snapshots.

### Admin Feedback Workspace

The admin dashboard should support:

- Inbox view.
- Status: new, triaged, investigating, resolved, closed.
- Priority.
- Category.
- Assignment.
- Internal notes.
- User reply or contact state.
- Links to related release, feature, or crash group.
- Audit history.

### Security

Feedback documents should be readable only by authorized support and admin roles. User contact details should be masked or minimized for analyst roles.

### Exit Criteria

- Feedback has a defined Firestore schema and retention policy.
- Admin triage actions are audited.
- Feedback can be correlated with app version and feature events.
- User-facing submission states handle offline and failed submissions.

## Phase 8: Push Notifications

### Objective

Manage notification campaigns and delivery health without replacing the mobile app's local reminder behavior.

### Current Baseline

The mobile app currently schedules local device notifications through [smart-grocery-app/utils/notification.service.js](../../smart-grocery-app/utils/notification.service.js). These include grocery reminders, pending-item reminders, session reminders, weekly summaries, and recurring-insight notifications.

Local notifications are not centrally controlled by the admin dashboard.

### Target Notification Model

Separate notification types:

1. **Local reminders**
   - Scheduled on-device.
   - Controlled by user settings.
   - Not directly sent by the admin dashboard.

2. **Remote operational notifications**
   - Sent through Firebase Cloud Messaging or the selected Expo-compatible push service.
   - Used for announcements, maintenance, release notices, and support responses.
   - Requires consent, token management, audience rules, and delivery logs.

### Admin Capabilities

- Draft notification.
- Preview notification.
- Define audience.
- Schedule or send.
- Cancel scheduled campaign.
- View delivery, open, and failure summaries.
- Enforce rate limits and approval workflow.
- Store campaign audit history.

### Security and Reliability

Push tokens should be stored user-scoped and treated as revocable identifiers. The admin browser must never send directly with server credentials. Sending should happen through a callable or backend-controlled function that validates role, audience, payload size, and rate limits.

### Exit Criteria

- Local and remote notification responsibilities are clearly separated.
- Token registration and removal are reliable.
- Campaign sends are auditable and permission-controlled.
- Delivery failures are visible.

## Phase 9: Remote Config

### Objective

Control safe product behavior and presentation changes without releasing a new mobile binary for every adjustment.

### Target Configuration Areas

- Feature flags.
- Smart Scan availability.
- Minimum supported app version.
- Maintenance mode.
- Notification defaults.
- Experiment assignments.
- Analytics sampling rates.
- UI copy or announcement banners.
- Operational limits such as image-size or request limits.

### Recommended Configuration Ownership

Remote Config values should be managed by a dedicated configuration service or Firebase Remote Config, with the admin dashboard acting as the controlled management interface.

The admin should support:

- Draft and published values.
- Environment separation.
- Value validation.
- Effective dates.
- Rollback.
- Change history.
- Role-based publishing.
- Emergency disablement.

### Mobile Communication

The mobile app should fetch configuration at startup and at controlled refresh intervals, apply defaults locally, and fail closed for security-sensitive features. Configuration should not be used to grant privileges; entitlement and authorization must remain server-enforced.

### Exit Criteria

- Defaults exist for offline startup.
- Configuration changes are versioned and audited.
- Rollback is tested.
- Sensitive authorization decisions are not delegated to client configuration.

## Phase 10: Admin Dashboard Integration and Operational UX

### Objective

Unify the new capabilities into a clear management portal without turning the dashboard into a collection of unrelated screens.

### Navigation Areas

The existing navigation in [admin/src/constants/app.js](../admin/src/constants/app.js) should evolve into:

- Overview
- Analytics
- Shopping
- Feature Usage
- Users
- Feedback
- Notifications
- Crashes and Reliability
- Remote Config
- Categories
- Settings
- Audit Log

### Dashboard Composition

The overview screen should contain:

- KPI strip.
- Active-user trend.
- Shopping-session trend.
- Crash-free release health.
- Feature adoption highlights.
- Feedback queue summary.
- Notification campaign status.
- Remote Config publishing status.
- Data freshness indicators.

### UX Requirements

- Every chart has a date range and scope.
- Every metric identifies its source and freshness.
- Loading, empty, stale, and permission-denied states are explicit.
- Destructive actions require confirmation.
- Admin users can see why a metric is unavailable.
- Dashboard pages remain responsive at mobile and desktop widths.

### Exit Criteria

- Navigation reflects role permissions.
- Overview links to detailed workflows.
- All data-heavy views use bounded queries or aggregate documents.
- Audit and freshness states are visible.

## Phase 11: Testing, Rollout, and Operations

### Objective

Deploy the portal incrementally with measurable correctness and controlled risk.

### Required Test Layers

- Firebase Emulator security-rule tests.
- Cloud Function authorization tests.
- Aggregate calculation tests.
- Contract tests for mobile event payloads.
- Admin route and role tests.
- KPI reconciliation tests.
- Notification audience and rate-limit tests.
- Remote Config rollback tests.
- Crash redaction tests.
- End-to-end support workflows.

### Rollout Strategy

1. Development Firebase project and emulator validation.
2. Staging project with synthetic or anonymized data.
3. Internal admin pilot.
4. Read-only production analytics.
5. Controlled operational writes.
6. Remote notification pilot with internal users.
7. Broader rollout after reliability and authorization review.

### Exit Criteria

- Production access is role-restricted.
- Monitoring and alerting are active.
- Data freshness and aggregation failures are observable.
- Rollback procedures are documented.
- Admin actions are auditable.

## Implementation Priority Summary

### High Priority

1. Firestore rules, admin roles, and audit model.
2. Canonical data and event contracts.
3. Analytics pipeline and KPI aggregates.
4. User-scoped privacy and retention rules.
5. Pagination and bounded admin queries.
6. Crash reporting integration and release health.
7. Reliable backend account deletion.

### Medium Priority

1. Shopping analytics.
2. Feature usage analytics.
3. Feedback management.
4. Push notification campaigns.
5. Remote Config with approvals and rollback.
6. Emulator and contract test coverage.
7. Admin data freshness and operational error states.

### Low Priority

1. Advanced experiments and cohort analysis.
2. Cross-feature drill-down dashboards.
3. Automated support recommendations.
4. Historical data warehouse export.
5. Advanced notification personalization.
6. Custom dashboard layouts by administrator.

## Final Architecture Principle

The mobile application should remain the source of authenticated user interactions, while Firebase and backend functions should provide secure persistence, event processing, aggregation, and privileged operations. The Admin Dashboard should consume the smallest authorized data set necessary for each workflow.

The portal should not become a second mobile client with unrestricted access to user data. Its role is to provide controlled operational visibility and audited management capabilities over well-defined Firebase contracts.
