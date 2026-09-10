import { collectionGroup, getDocs, orderBy, query, where } from 'firebase/firestore';

import { db } from '@/firebase/firebase';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_CUSTOM_RANGE_DAYS = 90;
const toDateKey = (date) => date.toISOString().slice(0, 10);
const toMonthKey = (date) => toDateKey(date).slice(0, 7);
const toUtcDayStart = (dateKey) => new Date(`${dateKey}T00:00:00.000Z`);
const addDays = (date, days) => new Date(date.getTime() + days * DAY_IN_MS);
const createRange = (startDate, endDate, label) => ({ endDate: toDateKey(endDate), label, startDate: toDateKey(startDate) });

export const analyticsDateRanges = {
  today: () => {
    const today = toUtcDayStart(toDateKey(new Date()));
    return createRange(today, today, 'Today');
  },
  last7Days: () => {
    const today = toUtcDayStart(toDateKey(new Date()));
    return createRange(addDays(today, -6), today, 'Last 7 days');
  },
  last30Days: () => {
    const today = toUtcDayStart(toDateKey(new Date()));
    return createRange(addDays(today, -29), today, 'Last 30 days');
  },
  thisMonth: () => {
    const today = toUtcDayStart(toDateKey(new Date()));
    return createRange(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)), today, 'This month');
  },
};

const createBucket = (date) => ({ activeUserIds: new Set(), date, eventCount: 0, featureUsage: {}, newUsers: 0 });
const increment = (object, key, value = 1) => { object[key] = (object[key] ?? 0) + value; };
const toPublicBucket = ({ activeUserIds, ...bucket }) => ({ ...bucket, activeUsers: activeUserIds.size });

const validateRange = ({ startDate, endDate }) => {
  const start = toUtcDayStart(startDate);
  const inclusiveEnd = toUtcDayStart(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(inclusiveEnd.getTime()) || start > inclusiveEnd) {
    throw new Error('Choose a valid analytics date range.');
  }
  if ((inclusiveEnd.getTime() - start.getTime()) / DAY_IN_MS + 1 > MAX_CUSTOM_RANGE_DAYS) {
    throw new Error(`Custom analytics ranges are limited to ${MAX_CUSTOM_RANGE_DAYS} days.`);
  }
  return { endExclusive: addDays(inclusiveEnd, 1), start };
};

export const analyticsService = {
  async getDashboardMetrics(range) {
    const { endExclusive, start } = validateRange(range);
    const snapshot = await getDocs(query(
      collectionGroup(db, 'analyticsEvents'),
      where('occurredAt', '>=', start),
      where('occurredAt', '<', endExclusive),
      orderBy('occurredAt', 'asc'),
    ));
    const dailyBuckets = new Map();
    const monthlyBuckets = new Map();
    const periodUserIds = new Set();
    const featureUsage = {};
    const shoppingActivity = { completedItemCount: 0, groceriesChecked: 0, groceriesCreated: 0, sessionsCompleted: 0, sessionsStarted: 0 };
    let newUsers = 0;

    snapshot.forEach((eventDocument) => {
      const event = eventDocument.data();
      const occurredAt = event.occurredAt?.toDate?.();
      const userId = eventDocument.ref.parent.parent?.id;
      if (!occurredAt || !userId || !event.eventName) return;

      const dateKey = toDateKey(occurredAt);
      const monthKey = toMonthKey(occurredAt);
      const daily = dailyBuckets.get(dateKey) ?? createBucket(dateKey);
      const monthly = monthlyBuckets.get(monthKey) ?? createBucket(monthKey);
      daily.activeUserIds.add(userId);
      monthly.activeUserIds.add(userId);
      periodUserIds.add(userId);
      daily.eventCount += 1;
      monthly.eventCount += 1;
      increment(daily.featureUsage, event.eventName);
      increment(monthly.featureUsage, event.eventName);
      increment(featureUsage, event.eventName);
      if (event.eventName === 'user_registered') {
        daily.newUsers += 1;
        monthly.newUsers += 1;
        newUsers += 1;
      }
      if (event.eventName === 'session_started') shoppingActivity.sessionsStarted += 1;
      if (event.eventName === 'session_completed') {
        shoppingActivity.sessionsCompleted += 1;
        const itemCount = Number(event.metadata?.itemCount ?? 0);
        shoppingActivity.completedItemCount += Number.isFinite(itemCount) && itemCount > 0 ? itemCount : 0;
      }
      if (event.eventName === 'grocery_created') shoppingActivity.groceriesCreated += 1;
      if (event.eventName === 'grocery_checked') shoppingActivity.groceriesChecked += 1;
      dailyBuckets.set(dateKey, daily);
      monthlyBuckets.set(monthKey, monthly);
    });

    for (let cursor = new Date(start); cursor < endExclusive; cursor = addDays(cursor, 1)) {
      const dateKey = toDateKey(cursor);
      const monthKey = toMonthKey(cursor);
      if (!dailyBuckets.has(dateKey)) dailyBuckets.set(dateKey, createBucket(dateKey));
      if (!monthlyBuckets.has(monthKey)) monthlyBuckets.set(monthKey, createBucket(monthKey));
    }

    const daily = [...dailyBuckets.values()].map(toPublicBucket).sort((first, second) => first.date.localeCompare(second.date));
    const monthly = [...monthlyBuckets.values()].map(toPublicBucket).sort((first, second) => first.date.localeCompare(second.date));

    return {
      daily,
      activeUsers: periodUserIds.size,
      eventCount: snapshot.size,
      featureUsage: Object.entries(featureUsage).map(([feature, usage]) => ({ feature, usage })).sort((first, second) => second.usage - first.usage),
      monthly,
      newUsers,
      range,
      shoppingActivity,
      updatedAt: new Date().toISOString(),
    };
  },
};
