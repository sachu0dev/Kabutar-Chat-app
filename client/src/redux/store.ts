import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.ts";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
  },
});

export default store;
