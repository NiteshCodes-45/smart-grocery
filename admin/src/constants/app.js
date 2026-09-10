import { appName, appVersion } from '@/config/env';
import company from '../../../company.json';

export const APP_NAME = appName;
export const APP_VERSION = appVersion;

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', iconName: 'dashboard' },
  { label: 'Analytics', path: '/analytics', iconName: 'analytics' },
  { label: 'Crashlytics', path: '/crashlytics', iconName: 'crashlytics' },
  { label: 'Users', path: '/users', iconName: 'users' },
  { label: 'Categories', path: '/categories', iconName: 'categories' },
  { label: 'Settings', path: '/settings', iconName: 'settings' },
];

export const INITIAL_SETTINGS = {
  appName: company.productName,
  currentVersion: APP_VERSION,
  supportEmail: company.supportEmail,
};
