import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { userService } from '@/services/userService';

const initialState = {
  error: null,
  status: 'idle',
  users: [],
  searchTerm: '',
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return await userService.listUsers();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to load users.');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setUserSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load users.';
      });
  },
});

export const { setUsers, setUserSearchTerm } = userSlice.actions;
export default userSlice.reducer;
