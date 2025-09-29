import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

// initial state
const initialState = {
  themeMode: 'light',
  openSidebar: false
};

// slice
const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode(state, action) {
      state.themeMode = action.payload;
    },

    toggleSidebar(state, action) {
      state.openSidebar = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { setThemeMode, toggleSidebar } = slice.actions;

// ----------------------------------------------------------------------
