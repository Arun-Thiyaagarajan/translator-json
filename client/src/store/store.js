import { configureStore } from "@reduxjs/toolkit";
import translationsReducer from "./slices/translationsSlice.js";

export const store = configureStore({
  reducer: {
    translations: translationsReducer,
  },
});