export const APP_NAME = 'Smart Grocery Admin';
export const APP_VERSION = '1.2.0';

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', iconName: 'dashboard' },
  { label: 'Users', path: '/users', iconName: 'users' },
  { label: 'Categories', path: '/categories', iconName: 'categories' },
  { label: 'Settings', path: '/settings', iconName: 'settings' },
];

export const MOCK_USERS = [
  {
    id: 'usr_001',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    createdDate: '2026-05-02T09:45:00.000Z',
    status: 'active',
  },
  {
    id: 'usr_002',
    name: 'Priya Shah',
    email: 'priya.shah@example.com',
    createdDate: '2026-05-11T12:15:00.000Z',
    status: 'pending',
  },
  {
    id: 'usr_003',
    name: 'Rahul Nair',
    email: 'rahul.nair@example.com',
    createdDate: '2026-05-21T16:20:00.000Z',
    status: 'active',
  },
  {
    id: 'usr_004',
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    createdDate: '2026-06-01T08:30:00.000Z',
    status: 'disabled',
  },
  {
    id: 'usr_005',
    name: 'Vikram Rao',
    email: 'vikram.rao@example.com',
    createdDate: '2026-06-12T10:05:00.000Z',
    status: 'active',
  },
];

export const MOCK_CATEGORIES = [
  { id: 'cat_001', name: 'Vegetables', icon: 'VG', active: true, createdDate: '2026-04-12T09:00:00.000Z' },
  { id: 'cat_002', name: 'Fruits', icon: 'FR', active: true, createdDate: '2026-04-13T09:00:00.000Z' },
  { id: 'cat_003', name: 'Dairy', icon: 'DY', active: true, createdDate: '2026-04-14T09:00:00.000Z' },
  { id: 'cat_004', name: 'Bakery', icon: 'BK', active: false, createdDate: '2026-04-15T09:00:00.000Z' },
];

export const INITIAL_DASHBOARD_STATS = {
  totalUsers: MOCK_USERS.length,
  totalCategories: MOCK_CATEGORIES.length,
  todaysSessions: 128,
  appVersion: APP_VERSION,
};

export const INITIAL_SETTINGS = {
  appName: 'Smart Grocery',
  currentVersion: APP_VERSION,
  supportEmail: 'contact.smartgrocery@gmail.com',
};

export const SESSION_CHART_DATA = [
  { day: 'Mon', sessions: 84 },
  { day: 'Tue', sessions: 102 },
  { day: 'Wed', sessions: 128 },
  { day: 'Thu', sessions: 116 },
  { day: 'Fri', sessions: 142 },
  { day: 'Sat', sessions: 168 },
  { day: 'Sun', sessions: 132 },
];
