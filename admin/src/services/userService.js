import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/firebase';
import { toIsoDate } from '@/utils/date';

const getStringField = (data, keys, fallback = '') => {
  const value = keys.map((key) => data[key]).find((field) => typeof field === 'string' && field.trim());

  return typeof value === 'string' ? value : fallback;
};

const getUserStatus = (data) => {
  const status = getStringField(data, ['status', 'accountStatus']).toLowerCase();

  if (status === 'disabled' || status === 'pending' || status === 'active') {
    return status;
  }

  if (data.disabled === true || data.active === false) {
    return 'disabled';
  }

  return 'active';
};

const mapUserDocument = (id, data) => {
  const email = getStringField(data, ['email', 'userEmail']);
  const name = getStringField(
    data,
    ['name', 'displayName', 'fullName', 'username'],
    email ? email.split('@')[0] : 'Unnamed user',
  );

  return {
    id,
    name,
    email,
    createdDate: toIsoDate(data.createdAt ?? data.createdDate ?? data.created_at ?? data.created),
    status: getUserStatus(data),
  };
};

export const userService = {
  async listUsers() {
    const usersSnapshot = await getDocs(collection(db, 'users'));

    return usersSnapshot.docs
      .map((document) => mapUserDocument(document.id, document.data()))
      .sort((first, second) => second.createdDate.localeCompare(first.createdDate));
  },
};
