import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/firebase';
import { toIsoDate } from '@/utils/date';

const mapCategoryDocument = (id, data) => ({
  id,
  name: typeof data.name === 'string' ? data.name : 'Untitled category',
  icon: typeof data.icon === 'string' ? data.icon : '',
  active: typeof data.active === 'boolean' ? data.active : true,
  createdDate: toIsoDate(data.createdAt ?? data.createdDate ?? data.created_at ?? data.created),
});

export const categoryService = {
  async listCategories() {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));

    return categoriesSnapshot.docs
      .map((document) => mapCategoryDocument(document.id, document.data()))
      .sort((first, second) => first.name.localeCompare(second.name));
  },

  async saveCategory(values, id) {
    if (id) {
      await updateDoc(doc(db, 'categories', id), {
        ...values,
        updatedAt: serverTimestamp(),
      });

      return {
        id,
        ...values,
        createdDate: new Date().toISOString(),
      };
    }

    const categoryRef = await addDoc(collection(db, 'categories'), {
      ...values,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: categoryRef.id,
      ...values,
      createdDate: new Date().toISOString(),
    };
  },
};
