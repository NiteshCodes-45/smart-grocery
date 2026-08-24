import { firebaseService } from '@/services/firebaseService';
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
    const categories = await firebaseService.listDocuments('categories');

    return categories
      .map(({ id, ...data }) => mapCategoryDocument(id, data))
      .sort((first, second) => first.name.localeCompare(second.name));
  },

  async saveCategory(values, id) {
    if (id) {
      await firebaseService.updateDocument('categories', id, values);

      return {
        id,
        ...values,
        createdDate: new Date().toISOString(),
      };
    }

    const category = await firebaseService.addDocument('categories', values);

    return {
      id: category.id,
      ...values,
      createdDate: new Date().toISOString(),
    };
  },
};
