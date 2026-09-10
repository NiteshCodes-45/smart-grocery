# Smart Grocery Architecture Comparison Report

**Repositories compared:**

- [smart-grocery](../)
- `smart-grocery-app` at `D:\Projects\smart-grocery-app`

No application files were modified while preparing this report.

## Executive Summary

These repositories represent different clients in the same product ecosystem:

| Repository | Primary role | Architecture |
|---|---|---|
| `smart-grocery` | Public website and web admin console | Vite React, React Router, Redux Toolkit, MUI, Firebase |
| `smart-grocery-app` | Mobile grocery application | Expo, React Native, React Context, Firebase, AsyncStorage |

They share product concepts and Firebase infrastructure, but currently have no shared source code, package, model, validation library, or workspace dependency.

The most important architectural issue is schema divergence between the mobile app and web admin. Before extracting shared code, the canonical Firestore data model, ownership rules, and role model should be formally defined.

## 1. Shared Concepts

Both repositories implement or describe the same product domain:

- Grocery items
- Categories
- Quantities and units
- Bought or checked states
- Shopping sessions
- Shopping history
- Recurring grocery items
- Spending and price insights
- User accounts
- Account deletion
- Firebase-backed persistence
- Smart Grocery branding and version metadata

Representative references:

- Web grocery input: [src/components/GroceryInput.jsx](../src/components/GroceryInput.jsx)
- Web grocery list: [src/components/GroceryList.jsx](../src/components/GroceryList.jsx)
- Mobile grocery model: [smart-grocery-app/grocery/grocery.model.js](../../smart-grocery-app/grocery/grocery.model.js)
- Mobile shopping state: [smart-grocery-app/store/shopping-context.js](../../smart-grocery-app/store/shopping-context.js)
- Mobile recurring state: [smart-grocery-app/recurring/recurring-context.js](../../smart-grocery-app/recurring/recurring-context.js)
- Shared product metadata: [company.json](../company.json)

The similarity is primarily conceptual. The implementations are separate.

## 2. Actual Duplication Versus Conceptual Similarity

### Actual Shared Code

No shared code was found:

- No cross-repository imports
- No shared npm package
- No workspace package dependency
- No common model package
- No common Firebase adapter
- No common validation package

### Parallel Implementations

Several responsibilities are implemented independently:

| Responsibility | Web implementation | Mobile implementation |
|---|---|---|
| Persistence | `useLocalStorage` | AsyncStorage offline services |
| Date normalization | `admin/src/utils/date.js` | Mobile timestamp helpers |
| Firebase initialization | Vite Firebase config | Expo Firebase config |
| User access | Admin Firestore users query | Authenticated user context |
| Categories | Global Firestore collection | Mostly local constants |
| Grocery shape | Lightweight `{ name, qty, category, bought }` | Rich model with units, prices, priority, frequency, and timestamps |
| State management | Redux Toolkit | React Context |
| UI framework | CSS and MUI | React Native components and styles |

References:

- [src/hooks/useLocalStorage.js](../src/hooks/useLocalStorage.js)
- [smart-grocery-app/utils/offline-storage.js](../../smart-grocery-app/utils/offline-storage.js)
- [admin/src/utils/date.js](../admin/src/utils/date.js)
- [smart-grocery-app/data/Constant.js](../../smart-grocery-app/data/Constant.js)

## 3. Shared Firebase Usage

### Web Admin

The web admin initializes:

- Firebase App
- Firebase Authentication
- Firestore

Reference: [admin/src/firebase/firebase.js](../admin/src/firebase/firebase.js)

It accesses:

- `admins/{uid}`
- `users`
- `categories`

References:

- [admin/src/services/authService.js](../admin/src/services/authService.js)
- [admin/src/services/userService.js](../admin/src/services/userService.js)
- [admin/src/services/categoryService.js](../admin/src/services/categoryService.js)

### Mobile App

The mobile app uses:

- Firebase Authentication
- Firestore
- Firebase Cloud Functions
- Emulator support
- React Native auth persistence

References:

- [smart-grocery-app/firebase/firebaseConfig.js](../../smart-grocery-app/firebase/firebaseConfig.js)
- [smart-grocery-app/store/auth-context.js](../../smart-grocery-app/store/auth-context.js)
- [smart-grocery-app/grocery/grocery.service.js](../../smart-grocery-app/grocery/grocery.service.js)
- [smart-grocery-app/functions/index.js](../../smart-grocery-app/functions/index.js)

Mobile data is user-scoped:

```text
users/{uid}
├── settings/main
├── groceries/{groceryId}
├── recurringItems/{recurringId}
├── shoppingSessions/{sessionId}
└── shoppingItems/{shoppingItemId}
```

### Important Compatibility Conflict

The web admin treats `categories` as a global collection, while the mobile app primarily uses local category constants.

The data models also differ:

- Web: `bought`
- Mobile: `checked` and `isBought`

- Web: `qty`
- Mobile: `qty`, `quantity`, `unit`, and `unitType`

- Web: title-case category names
- Mobile: normalized lower-case category values

A shared Firebase service cannot be introduced safely until these differences are resolved.

## 4. Shared Utilities

### Persistence

The web implementation serializes state to browser storage:

- [src/hooks/useLocalStorage.js](../src/hooks/useLocalStorage.js)

The mobile application serializes user data to AsyncStorage:

- [smart-grocery-app/utils/offline-storage.js](../../smart-grocery-app/utils/offline-storage.js)
- [smart-grocery-app/utils/settings-storage.js](../../smart-grocery-app/utils/settings-storage.js)

These should not share platform-specific storage code, but they could share a platform-neutral serialization contract.

### Date Handling

Both applications normalize Firebase timestamps and display dates:

- [admin/src/utils/date.js](../admin/src/utils/date.js)
- [smart-grocery-app/data/Constant.js](../../smart-grocery-app/data/Constant.js)
- [smart-grocery-app/screens/SessionHistoryScreen.js](../../smart-grocery-app/screens/SessionHistoryScreen.js)

Pure date normalization functions could be shared.

### Validation

The web admin uses Zod:

- [admin/src/pages/Login/LoginPage.jsx](../admin/src/pages/Login/LoginPage.jsx)
- [admin/src/pages/Categories/CategoriesPage.jsx](../admin/src/pages/Categories/CategoriesPage.jsx)

The mobile app mostly uses imperative validation:

- [smart-grocery-app/components/AddGroceryForm.js](../../smart-grocery-app/components/AddGroceryForm.js)
- [smart-grocery-app/data/Constant.js](../../smart-grocery-app/data/Constant.js)

A shared validation package would reduce inconsistent behavior.

## 5. Code That Could Become Common Libraries

A future monorepo could contain:

```text
apps/
├── web/
├── admin/
└── mobile/

packages/
├── domain/
├── validation/
├── date-utils/
├── analytics/
└── firebase-contracts/
```

### High-Value Shared Packages

#### `packages/domain`

Could contain platform-neutral models and normalizers:

- Grocery item
- Category
- Shopping session
- Shopping item
- Recurring item
- User profile
- Status enums
- Canonical field names

Potential source inputs:

- [smart-grocery-app/grocery/grocery.model.js](../../smart-grocery-app/grocery/grocery.model.js)
- [admin/src/services/categoryService.js](../admin/src/services/categoryService.js)
- [smart-grocery-app/store/shopping-context.js](../../smart-grocery-app/store/shopping-context.js)

#### `packages/validation`

Could contain schemas for:

- Grocery creation
- Category creation
- User profile
- Shopping completion
- Recurring-item configuration

Zod is already used in the admin and could be adopted by the mobile app.

#### `packages/date-utils`

Could contain:

- Firestore timestamp normalization
- ISO date conversion
- Session date grouping
- Recurring date calculations

#### Pure Business Logic

The following logic is good candidates for shared, framework-independent modules:

- Quantity-step calculation
- Duplicate grocery detection
- Recurring cost calculation
- Purchase cadence calculation
- Shopping completion rules
- Category normalization
- Price aggregation

### Keep Platform-Specific

These should remain separate adapters:

- Firebase initialization
- Auth persistence
- AsyncStorage
- Browser localStorage
- React Context providers
- Redux slices
- React Native notification handling
- MUI and React Native UI components

## 6. Security Improvements

### High Priority

1. **Add versioned Firestore security rules.**

   Neither repository contains a versioned `firestore.rules` file. Rules should enforce:

   ```text
   request.auth.uid == userId
   ```

   for user-owned mobile data.

2. **Restrict admin access by role.**

   The admin currently checks whether a document exists in `admins/{uid}`:

   - [admin/src/services/authService.js](../admin/src/services/authService.js)

   Firestore rules must independently enforce admin reads and writes. Client-side route protection is not sufficient.

3. **Fix mobile settings storage scoping.**

   [smart-grocery-app/utils/settings-storage.js](../../smart-grocery-app/utils/settings-storage.js) uses a global `APP_SETTINGS` key. Settings should be namespaced by user ID to prevent account crossover on shared devices.

4. **Move account deletion to a backend workflow.**

   Client-side deletion can fail halfway through and leave orphaned documents. A callable Cloud Function or scheduled cleanup workflow should handle deletion atomically or with explicit retry tracking.

5. **Protect Smart Scan with server-side controls.**

   [smart-grocery-app/functions/index.js](../../smart-grocery-app/functions/index.js) already checks authentication and premium eligibility. It should additionally use:

   - App Check
   - Rate limiting
   - Usage quotas
   - Cost monitoring
   - Strict image-size and MIME validation

### Medium Priority

- Enforce email verification in Firestore rules.
- Restore mobile environment validation.
- Remove production logs containing project or environment metadata.
- Add audit logging for admin category changes.
- Add explicit admin role and permission claims.
- Review sensitive keystore files and rotate credentials if they were ever committed.

## 7. Folder Improvements

The current workspace contains a nested web admin application and a separate mobile repository. A clearer structure would be:

```text
smart-grocery-platform/
├── apps/
│   ├── web/
│   ├── admin/
│   └── mobile/
├── packages/
│   ├── domain/
│   ├── validation/
│   ├── date-utils/
│   └── firebase-contracts/
├── backend/
│   ├── functions/
│   └── firestore/
└── docs/
```

Recommended folder changes:

- Move `smart-grocery/admin` into a first-class `apps/admin` package.
- Move mobile Firebase Functions into a clearly named backend package.
- Consolidate mobile persistence helpers.
- Separate pure domain logic from React Context providers.
- Keep Firebase rules, indexes, migrations, and emulator data in a versioned backend directory.
- Standardize JavaScript and TypeScript conventions.
- Remove ambiguous or unused directories such as reserved `types` or feature folders unless they have an ownership plan.

## 8. Scalability Concerns

### Web Admin

The admin currently loads complete collections:

- [admin/src/services/userService.js](../admin/src/services/userService.js)
- [admin/src/services/categoryService.js](../admin/src/services/categoryService.js)

This will become expensive as data grows. Use:

- Firestore pagination
- Bounded queries
- Server-side filtering
- Search indexes or a dedicated search service
- Cursor-based pagination

### Mobile App

The mobile app uses realtime listeners and local caches. This is appropriate for a personal grocery app, but risks include:

- Large shopping history listeners
- Large shopping-item collections
- Repeated cache reconciliation
- Multiple concurrent optimistic writes
- Unclear conflict-resolution behavior

History should eventually be queried by date range, and old records could be archived or summarized.

### Account Deletion

The current deletion workflow can become slow and expensive because it reads and deletes multiple collections client-side.

### Analytics

The web admin dashboard uses placeholder session data:

- [admin/src/pages/Dashboard/DashboardPage.jsx](../admin/src/pages/Dashboard/DashboardPage.jsx)

Analytics should be sourced from controlled aggregate documents or a backend analytics pipeline rather than calculated from full client collections.

## 9. Technical Debt

### High-Impact Debt

- No versioned Firestore rules.
- No canonical shared data contract.
- Mobile settings storage is not consistently user-scoped.
- Admin role permissions are still incomplete.
- Account deletion is not a reliable backend operation.
- Web and mobile field names diverge.

### Medium-Impact Debt

- Mobile environment validation is disabled or incomplete.
- Admin settings are not persisted to Firestore: [admin/src/pages/Settings/SettingsPage.jsx](../admin/src/pages/Settings/SettingsPage.jsx)
- Dashboard analytics are placeholder data.
- Debug `console.log` statements remain in application contexts.
- Offline mutation failures are not represented by a durable retry/error state.
- The web grocery UI is not connected to the current public route tree.

### Low-Impact Debt

- Mixed JavaScript and TypeScript conventions in the mobile app.
- Product metadata is distributed across `company.json`, app constants, and Expo configuration.
- Generated artifacts and local files require stricter repository hygiene.
- Some installed packages have limited or unclear source usage.

## 10. Recommended Improvements

### High Priority

1. Define and deploy Firestore security rules.
2. Establish a canonical domain schema and field naming convention.
3. Scope all mobile local storage by authenticated user.
4. Replace client-side account deletion with a backend-controlled workflow.
5. Add admin role-based permissions in both UI and Firestore rules.
6. Add pagination and bounded queries to admin collection screens.
7. Add App Check and rate limits to Smart Scan.
8. Add automated contract tests for web admin and mobile Firestore documents.

### Medium Priority

1. Create `packages/domain` for pure models and business rules.
2. Create `packages/validation` using shared Zod schemas.
3. Consolidate offline persistence abstractions.
4. Standardize category values and grocery field names.
5. Replace placeholder dashboard analytics with aggregate data.
6. Add explicit offline conflict-resolution and retry states.
7. Restore environment validation and remove production debug logging.
8. Add Firestore emulator tests for authorization and data ownership.

### Low Priority

1. Convert the workspace to an explicit monorepo layout.
2. Standardize TypeScript adoption across projects.
3. Centralize product metadata.
4. Consolidate ignore files and generated artifact handling.
5. Remove unused dependencies and reserved folders.
6. Document collection ownership and lifecycle conventions.

## 11. Recommended Canonical Domain Model

Before sharing code, use one schema such as:

```js
{
  id,
  name,
  normalizedName,
  categoryId,
  categoryName,
  quantity,
  unit,
  unitType,
  pricePerUnit,
  frequency,
  priority,
  checked,
  createdAt,
  updatedAt
}
```

The web UI can derive presentation-specific fields such as `bought`, while the shared domain model remains consistent.

Categories should use stable IDs rather than display names:

```js
{
  id,
  name,
  normalizedName,
  icon,
  active,
  createdAt,
  updatedAt
}
```

## Conclusion

`smart-grocery-app` is the feature-rich product client, with realtime Firestore synchronization, offline caching, recurring-item intelligence, notifications, and Smart Scan. `smart-grocery` is the web-facing product and operational console, with marketing pages and an admin dashboard.

The repositories should not share UI or Firebase initialization directly. The best extraction boundary is a small, platform-neutral domain and validation layer. Security rules, canonical schemas, user-scoped persistence, and admin authorization should be resolved before introducing shared libraries.
