import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

// initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  count: 0,
  isInitialized: false
};

// slice
const slice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setLogin(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },

    setCount(state) {
      state.count = state.count + 1;
    },
    setInitialize(state) {
      state.isInitialized = true;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { setLogin, setLogout, setCount, setInitialize } = slice.actions;

// ----------------------------------------------------------------------
