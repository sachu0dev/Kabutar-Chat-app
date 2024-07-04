import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.ts";
import api from "./api/api.ts";
import miscSlice from "./reducers/misc.ts";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (defaultMiddleware) => [...defaultMiddleware(), api.middleware],
});

export default store;
