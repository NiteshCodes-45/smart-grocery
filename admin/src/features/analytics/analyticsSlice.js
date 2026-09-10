import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { analyticsDateRanges, analyticsService } from '@/services/analyticsService';

const initialState = {
  activeUsers: 0,
  daily: [],
  error: null,
  eventCount: 0,
  featureUsage: [],
  monthly: [],
  newUsers: 0,
  range: analyticsDateRanges.last30Days(),
  shoppingActivity: null,
  status: 'idle',
  updatedAt: null,
};

export const fetchAnalytics = createAsyncThunk('analytics/fetchAnalytics', async (range, { getState, rejectWithValue }) => {
  try {
    return await analyticsService.getDashboardMetrics(range ?? getState().analytics.range);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Unable to load analytics.');
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Object.assign(state, action.payload);
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to load analytics.';
      });
  },
});

export default analyticsSlice.reducer;
