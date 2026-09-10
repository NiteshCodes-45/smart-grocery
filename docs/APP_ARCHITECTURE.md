# Smart Grocery App — Architecture Report

Repository reviewed read-only: `D:\Projects\smart-grocery-app`. No application files were modified while preparing this report.

## 1. Folder structure

```text
smart-grocery-app/
├── App.js / index.js                 # Application composition and Expo entry
├── navigation/                       # Root, auth, onboarding, stack, and tabs
├── screens/                          # Route-level screens
├── components/                       # Shared, feature, UI, settings, and skeleton components
├── store/                            # React Context state domains and hooks
├── grocery/                          # Grocery model, service, and state context
├── recurring/                        # Recurring-item model and state context
├── firebase/                         # Firebase initialization and environment validation
├── functions/                        # Firebase callable Cloud Function
├── notifications/                    # In-app toast provider
├── utils/                            # Storage, notification, and smart-scan services
├── data/                             # Constants, options, validation helpers
├── theme/                            # Light/dark theme tokens
├── migrations/                       # Firestore data migration
├── __tests__/                        # Jest tests
└── assets/                           # App images, icons, splash assets
```

The design is feature-oriented in parts (`grocery/`, `recurring/`) and cross-cutting in others (`store/`, `utils/`, `components/`).

## 2. Technology stack

- React 19.1 and React Native 0.81.5.
- Expo SDK 54 with a generated Android project.
- Firebase v12: Authentication, Firestore, Cloud Functions, Emulator support.
- React Navigation v7 native stack and bottom tabs.
- React Context + hooks for state management; no Redux Toolkit is installed or used.
- AsyncStorage for locally cached offline state.
- Jest, React Native Testing Library, Detox configuration for testing.

Evidence: [package.json](../package.json).

## 3. Expo configuration

[app.json](../app.json) defines portrait-only UI, the Android package `com.neets.smartgrocery`, new architecture support, splash/adaptive-icon assets, notification/date-picker plugins, EAS metadata, and blocked Android permissions.

[app.config.js](../app.config.js) can load an environment file through `ENVFILE`, then exposes selected metadata through Expo `extra`:

```js
extra: {
  ...(expoConfig.extra || {}),
  selectedEnv: process.env.EXPO_PUBLIC_ENV,
  selectedFirebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
}
```

## 4. React Native architecture

The app is provider-composed at the root. UI screens consume domain contexts; contexts own Firestore subscriptions, local cache updates, and mutation methods.

[App.js](../App.js):

```jsx
<NetworkProvider>
  <AuthProvider>
    <SettingsProvider>
      <ThemeProvider>
        <RecurringProvider>
          <GroceryContextProvider>
            <ShoppingProvider>
              <NotificationProvider>
                <SmartRecurringProvider>
                  <NavigationWrapper />
```

This is a client-centric, realtime architecture. Firestore is the backend source of truth, with AsyncStorage used as a per-user offline cache.

## 5. Navigation architecture

[RootNavigation.js](../navigation/RootNavigation.js) is a state-gated router:

```jsx
if (!isAuthenticated) return <AuthStack />;
if (!isEmailVerified) return <VerifyEmail />;
if (!userProfile?.hasCompletedOnboarding) return <OnboardingStack />;
return <AppStack />;
```

```text
NavigationContainer
└── RootNavigation
    ├── AuthStack: Landing, Login, Register, ForgotPassword
    ├── VerifyEmail
    ├── OnboardingStack: Guide, GrocerySelection
    └── AppStack
        ├── MainTabs: Dashboard*, Grocery, Shopping, History, Profile
        ├── Grocery add/edit
        ├── Settings / ChangeEmail / About
        ├── History, session details, analytics
        └── Smart Scan / Recurring Insights
```

`Dashboard` is conditionally shown only after grocery items exist. [MainTabs.js](../navigation/MainTabs.js) also uses a navigation ref, declared in [App.js](../App.js), to support notification-tap navigation.

## 6. Redux Toolkit structure

Redux Toolkit is not present in this repository: there is no `@reduxjs/toolkit`, Redux store, reducer, slice, `dispatch`, or selector.

The equivalent state domains are React Context providers: `AuthProvider`, `SettingsProvider`, `ThemeProvider`, `NetworkProvider`, `GroceryContextProvider`, `ShoppingProvider`, `RecurringProvider`, `SmartRecurringProvider`, and `NotificationProvider`.

## 7. Firebase Authentication

[firebaseConfig.js](../firebase/firebaseConfig.js) initializes Firebase Auth with React Native persistence:

```js
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
```

[auth-context.js](../store/auth-context.js) manages session restoration, email/password registration/login, email verification, password reset, reauthentication, email changes, account deletion, profile synchronization, and friendly Firebase error mapping.

Signup creates both a Firebase Auth identity and Firestore profile:

```js
await setDoc(doc(db, "users", cred.user.uid), {
  name, email: normalizedEmail, location, role, isPremium,
  hasCompletedOnboarding: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

## 8. Firestore collections

```text
users/{uid}
├── settings/main
├── groceries/{groceryId}
├── recurringItems/{recurringId}
├── shoppingSessions/{sessionId}
└── shoppingItems/{shoppingItemId}
```

All domain data is scoped under the authenticated user's document.

## 9. Database schema

| Collection/document | Main fields |
|---|---|
| `users/{uid}` | `name`, `email`, `location`, `role`, `isPremium`, `hasCompletedOnboarding`, timestamps |
| `settings/main` | `theme`, `currency`, defaults, notification options, onboarding flag |
| `groceries/{id}` | `name`, `normalizedName`, `category`, `qty`, `unit`, `unitType`, `pricePerUnit`, `frequency`, `priority`, `priorityOrder`, `checked`, timestamps |
| `recurringItems/{id}` | `groceryId`, `name`, `pricePerUnit`, `startDate`, `skippedDates`, `active`, timestamps |
| `shoppingSessions/{id}` | `status: ACTIVE | COMPLETED`, `startedAt`, `finishedAt`, local timestamp |
| `shoppingItems/{id}` | `sessionId`, `groceryId`, `name`, `category`, `unit`, `qty`, `price`, `isBought`, timestamps |

[grocery.model.js](../grocery/grocery.model.js) normalizes records:

```js
return {
  name: data.name?.trim() || "",
  qty: data.qty ?? 1,
  frequency: data.frequency?.toLowerCase() || "once",
  priority,
  priorityOrder: priorityMap[priority] ?? 0,
  updatedAt: serverTimestamp(),
};
```

No Firestore security rules file is present in the repository, and [firebase.json](../firebase.json) does not declare one.

## 10. Services

- [grocery.service.js](../grocery/grocery.service.js): Grocery Firestore CRUD and ordered realtime subscriptions.
- [notification.service.js](../utils/notification.service.js): Permission, scheduling, deduplication, and cancellation.
- [offline-storage.js](../utils/offline-storage.js): Namespaced AsyncStorage persistence.
- [smart-scan.service.js](../utils/smart-scan.service.js): Calls the `scanGroceryItem` callable Function.
- [functions/index.js](../functions/index.js): Server-side AI grocery image scan.

## 11. Custom hooks

All domain contexts expose custom hooks such as:

```js
export function useGrocery() {
  return useContext(GroceryContext);
}
```

See [grocery-context.js](../grocery/grocery-context.js), [shopping-context.js](../store/shopping-context.js), [auth-context.js](../store/auth-context.js), [settings-context.js](../store/settings-context.js), [theme-context.js](../store/theme-context.js), [network-context.js](../store/network-context.js), [recurring-context.js](../recurring/recurring-context.js), and [smart-recurring-context.js](../store/smart-recurring/smart-recurring-context.js).

[responsive-hook.js](../store/responsive/responsive-hook.js) returns responsive breakpoints from `useWindowDimensions`.

## 12. Utility functions

[data/Constant.js](../data/Constant.js) centralizes category/unit/frequency lists, unit rules, email validation, and Firestore timestamp parsing.

```js
function getQuantityStep(unit, unitType) {
  if (unitType === "COUNT") return 1;
  if (unitType === "WEIGHT") return unit === "gm" ? 50 : 0.25;
  if (unitType === "VOLUME") return unit === "ml" ? 50 : 0.25;
  return 1;
}
```

[recurring.utils.js](../components/recurring/recurring.utils.js) calculates recurring daily/monthly/lifetime costs after skipped dates.

## 13. Shared components

Reusable UI includes `InputRow`, `PickerRow`, `SwitchRow`, `TimePicker`, `Buttons`, `IconButton`, `QuantityPicker`, `QuantityButtons`, `ScreenBackground`, `OfflineBanner`, `NotFoundItem`, and skeleton loaders.

[NotificationProvider.js](../notifications/NotificationProvider.js) supplies standardized feedback:

```js
const value = {
  success: (msg, d) => show("success", msg, d),
  error: (msg, d) => show("error", msg, d),
  info: (msg, d) => show("info", msg, d),
};
```

## 14. Feature modules

- Grocery: CRUD, filtering, priority, and onboarded seed items.
- Shopping: active sessions, bought state, prices, and completion.
- Recurring: daily recurring items, skip dates, and expense calculation.
- Smart recurring: inferred purchase cadence from shopping history.
- History/analytics: completed sessions, totals, charts, and price history.
- Smart Scan: camera image → base64 → callable Function → confirmation.

## 15. Shopping workflow

1. A grocery item is added to an active session; one is created if required.
2. A session item stores a grocery snapshot, quantity, price, and bought state.
3. Price is required before marking an item bought.
4. Completion requires at least one item and every item bought.
5. Completed sessions feed history and analytics.

[shopping-context.js](../store/shopping-context.js):

```js
if (itemsInSession.length === 0) {
  throw new Error("Cannot complete an empty shopping session.");
}
if (hasUnboughtItems) {
  throw new Error("All items must be marked bought before completing the session.");
}
```

## 16. Grocery workflow

The grocery provider hydrates the cache, starts a Firestore listener, merges cache and remote data, optimistically updates local state, prevents duplicates, and automatically creates recurring records for daily groceries.

[grocery-context.js](../grocery/grocery-context.js):

```js
const duplicate = checkDuplicateGrocery({ items: currentItems, item });
if (duplicate) {
  return { success: false, message: "Item already exists in the same category" };
}
```

## 17. Recurring items workflow

A daily grocery creates a recurring record; deleting it removes the corresponding recurring record.

```js
if (groceryId && model.frequency === "daily") {
  createRecurringFromGrocery(model, groceryId);
}
```

Evidence: [grocery-context.js](../grocery/grocery-context.js) and [recurring-context.js](../recurring/recurring-context.js). Records track `startDate`, `pricePerUnit`, `active`, and `skippedDates`.

## 18. History workflow

[SessionHistoryScreen.js](../screens/SessionHistoryScreen.js) filters completed sessions, resolves Firestore/local timestamps, sorts newest-first, and groups records by month.

```js
const completedSessions = sessions
  .filter((s) => s.status === "COMPLETED")
  .map((session) => ({ ...session, _sessionDate: getSessionTimestamp(session) }))
  .filter((session) => session._sessionDate)
  .sort((a, b) => b._sessionDate - a._sessionDate);
```

It combines shopping totals and recurring estimates. [SessionDetailScreen.js](../screens/SessionDetailScreen.js) displays individual session items.

## 19. Notifications

There are two notification layers:

1. In-app animated toast messages through `NotificationProvider`.
2. Device-local scheduled notifications through `expo-notifications`.

Supported reminders include daily grocery prompts, pending shopping reminders, incomplete sessions, weekly summaries, and recurring-insight notifications. [notification.service.js](../utils/notification.service.js) deduplicates schedules by title/body. Notification taps use a navigation ref in [App.js](../App.js).

## 20. Offline support

Offline behavior combines NetInfo connectivity, user-scoped AsyncStorage cache, Firestore metadata (`fromCache`, `hasPendingWrites`), optimistic mutations, and `pendingSync` markers.

[offline-storage.js](../utils/offline-storage.js):

```js
const key = (uid, name) => `offline:${uid}:${name}`;
await AsyncStorage.setItem(key(uid, name), JSON.stringify(data));
```

[OfflineBanner.js](../components/OfflineBanner.js) communicates that changes will synchronize after connectivity returns. Client-side merging does not establish an explicit conflict-resolution policy beyond Firestore behavior and timestamps.

## 21. Error handling

- [ErrorBoundary.js](../ErrorBoundary.js) catches render failures.
- Auth errors are translated into user-facing messages.
- Async operations generally use `try/catch` and toast/alert feedback.
- Auth/settings startup uses four-second fallbacks.
- Smart Scan reports callable-function failures through toasts.

Many Firestore mutation failures are logged after optimistic updates rather than surfaced as a persistent failed-sync UI state.

## 22. Form validation

Validation is local and imperative: required grocery name, required daily price for high-priority daily items, duplicate prevention, email regex validation, matching confirmations in auth forms, and shopping completion prerequisites.

[AddGroceryForm.js](../components/AddGroceryForm.js):

```js
if (name.trim().length === 0) {
  notify.info("Please enter a grocery item name.");
  return;
}
```

## 23. Performance optimizations

- `FlatList` and `SectionList` virtualize grocery/history lists.
- `useMemo` derives totals, history sections, chart data, active session, and recurring insights.
- `useCallback` stabilizes provider helpers.
- `useRef` avoids stale values during asynchronous flows.
- Skeletons provide loading continuity.
- The dashboard restock carousel uses calculated width and snap intervals.

[smart-recurring-context.js](../store/smart-recurring/smart-recurring-context.js) memoizes insight generation from `sessionItems`.

## 24. Security considerations

Strengths:

- Firebase configuration is environment-driven and `.env` files are ignored.
- Firebase Auth persistence is framework-provided.
- Smart Scan requires authentication, checks premium eligibility on the server, validates MIME type/image size, and uses a Firebase-managed OpenAI secret.
- Android blocks several unnecessary permissions.

[functions/index.js](../functions/index.js):

```js
if (!request.auth?.uid) {
  throw new HttpsError("unauthenticated", "You must be signed in...");
}
await assertPremiumUser(request.auth.uid);
```

Risks:

- Firestore security rules are not versioned in this repository.
- Keystore (`.jks`) files are present at the repository root despite being ignored now; treat them as sensitive and rotate if they have ever been committed remotely.
- Project metadata is logged at startup.
- Offline profile data is stored unencrypted in AsyncStorage.

## 25. Packages and purpose

| Package group | Why used |
|---|---|
| `expo`, `react`, `react-native` | Application runtime |
| `@react-navigation/*` | Stack and tab navigation |
| `firebase` | Authentication, Firestore, Functions, emulator support |
| `@react-native-async-storage/async-storage` | Auth persistence and offline cache |
| `@react-native-community/netinfo` | Connectivity state |
| `expo-notifications` | Device notification scheduling and responses |
| `expo-image-picker`, `expo-file-system` | Camera capture and base64 conversion |
| `expo-splash-screen`, `expo-status-bar`, `expo-updates` | Startup, visual status, OTA runtime support |
| `gesture-handler`, `reanimated`, `screens`, `safe-area-context` | Native interaction/navigation foundations |
| Picker/date-picker/dropdown packages | Form selection controls |
| `react-native-keyboard-aware-scroll-view` | Keyboard-safe forms |
| `react-native-gifted-charts`, `react-native-svg` | Charts and SVG rendering |
| Jest, Testing Library, Detox | Unit/component/device testing |
| `cross-env` | Cross-platform build environment scripts |

`uuid`, `expo-crypto`, `expo-linking`, `expo-linear-gradient`, and `expo-checkbox` are installed; primary source usage is limited or not evident.

## 26. JavaScript concepts used

The source uses ES modules, async/await, Promises, closures, higher-order array methods, immutable transformations, destructuring, default parameters, template literals, regex, optional chaining, nullish coalescing, and class lifecycle methods for the error boundary.

[grocery-context.js](../grocery/grocery-context.js):

```js
const nextItems = currentItems.map((item) =>
  item.id === id
    ? { ...item, ...updatedItem, pendingSync: true, updatedAtLocal: Date.now() }
    : item
);
```

## 27. Modern JavaScript features used

Important modern syntax includes object/array spread, optional chaining (`userProfile?.hasCompletedOnboarding`), nullish coalescing (`data.qty ?? 1`), Unicode regex property escapes, arrow functions, async functions, and `Promise` APIs.

## 28. React concepts used

Functional components, JSX, Context API, nested providers, `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`, derived state, conditional rendering, and a class error boundary are all used.

## 29. React Native concepts used

The application uses native primitives (`View`, `Text`, `Pressable`, `TextInput`), virtualized lists, `ScrollView`, `StyleSheet`, `Animated`, safe-area insets, `Appearance`, responsive dimensions, platform layout conditions, and camera permissions.

## 30. Expo modules used

Directly used: `expo-notifications`, `expo-splash-screen`, `expo-status-bar`, `expo-image-picker`, and `expo-file-system`.

Configured/installed Expo capabilities include `expo-updates`, `expo-linking`, `expo-linear-gradient`, `expo-checkbox`, and `expo-crypto`, although direct use in primary source is limited or not evident.

## 31. TypeScript patterns

TypeScript adoption is minimal. [tsconfig.json](../tsconfig.json) extends Expo's base configuration, while [appInfo.ts](../src/constants/appInfo.ts) is the only TypeScript source detected. Most application code is JavaScript; typed Firestore models, navigation params, and reducer/state types are not implemented.

## 32. Design patterns

- Provider pattern: state domains expose React Context providers.
- Repository/service pattern: grocery Firestore calls are isolated in `grocery.service.js`.
- Model/factory pattern: grocery and recurring normalizers produce persistence-ready data.
- Observer pattern: Firestore `onSnapshot` and Auth `onAuthStateChanged`.
- Optimistic UI pattern: local state/cache update before remote write completion.
- Facade pattern: context hooks hide Firebase details from UI components.
- Boundary pattern: `ErrorBoundary` isolates render crashes.
- Data-driven configuration: themes, currencies, units, priorities, and categories are constants.

## 33. State management flow

```text
UI screen/component
  → Context action (for example, addItemToSession)
  → optimistic React state + AsyncStorage cache
  → Firestore setDoc/updateDoc/deleteDoc
  → Firestore onSnapshot
  → state reconciliation + pendingSync metadata
  → re-rendered UI / analytics / notifications
```

## 34. Data flow

```text
shoppingItems
  → generateRecurringInsights()
  → SmartRecurringContext
  → Dashboard restock cards / Recurring Insights
  → optional recurring notification
```

[recurring-utils.js](../store/smart-recurring/recurring-utils.js) groups purchases by normalized name, calculates average purchase gap, then computes a score from frequency and cadence.

## 35. Reusable architecture decisions

- Dedicated hooks provide deliberate APIs per state domain.
- User-scoped Firestore paths partition persisted data.
- Shared constants keep input controls and calculations consistent.
- Per-user offline cache names prevent cross-account cache collisions.
- Theme tokens drive screen and navigation styling.
- Models isolate normalization/defaulting from screen components.
- Skeletons and toast notifications standardize feedback states.
- A centralized navigation reference supports actions outside React components.

## Conclusion

The repository is a feature-rich Expo/Firebase React Native application using Context-based domain state, realtime Firestore listeners, optimistic offline caching, and a feature-oriented UI layer. The most consequential architecture gaps are absent versioned Firestore rules, minimal TypeScript adoption, and limited visible handling of background sync failures.
