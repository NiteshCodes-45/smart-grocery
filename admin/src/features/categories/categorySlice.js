import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { categoryService } from '@/services/categoryService';

const initialState = {
  categories: [],
  error: null,
  status: 'idle',
  saving: false,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await categoryService.listCategories();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to load categories.');
  }
});

export const saveCategory = createAsyncThunk('categories/saveCategory', async ({ id, values }, { rejectWithValue }) => {
  try {
    return await categoryService.saveCategory(values, id);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to save category.');
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    addCategory(state, action) {
      state.categories.unshift({
        id: `cat_${crypto.randomUUID()}`,
        createdDate: new Date().toISOString(),
        ...action.payload,
      });
    },
    updateCategory(state, action) {
      const category = state.categories.find((item) => item.id === action.payload.id);

      if (category) {
        category.name = action.payload.values.name;
        category.icon = action.payload.values.icon;
        category.active = action.payload.values.active;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load categories.';
      })
      .addCase(saveCategory.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveCategory.fulfilled, (state, action) => {
        state.saving = false;

        const existingIndex = state.categories.findIndex((category) => category.id === action.payload.id);

        if (existingIndex >= 0) {
          state.categories[existingIndex] = {
            ...state.categories[existingIndex],
            ...action.payload,
          };
          return;
        }

        state.categories.unshift(action.payload);
      })
      .addCase(saveCategory.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Unable to save category.';
      });
  },
});

export const { addCategory, setCategories, updateCategory } = categorySlice.actions;
export default categorySlice.reducer;
