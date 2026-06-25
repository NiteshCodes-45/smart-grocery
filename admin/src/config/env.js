import packageJson from '../../package.json';

const requiredFirebaseKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const getEnvValue = (key, fallback = '') => import.meta.env[key] || fallback;

const getRequiredEnvValue = (key) => {
  const value = getEnvValue(key);

  if (!value) {
    throw new Error(
      `[Smart Grocery Admin] Missing required environment variable: ${key}. Add it to the active Vite env file.`,
    );
  }

  return value;
};

export const appName = getEnvValue('VITE_APP_NAME', 'Smart Grocery Admin');
export const environment = getEnvValue('VITE_APP_ENV', import.meta.env.MODE || 'development');
export const apiBaseUrl = getEnvValue('VITE_API_BASE_URL');
export const appVersion = packageJson.version;

export const firebaseConfig = {
  apiKey: getRequiredEnvValue('VITE_FIREBASE_API_KEY'),
  authDomain: getRequiredEnvValue('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnvValue('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnvValue('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnvValue('VITE_FIREBASE_APP_ID'),
};

export const validateEnvironment = () => {
  requiredFirebaseKeys.forEach(getRequiredEnvValue);
};
