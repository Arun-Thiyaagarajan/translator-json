import { configureStore } from "@reduxjs/toolkit";
import translationsReducer from "@store/slices/translationsSlice";

export const store = configureStore({
  reducer: {
    translations: translationsReducer,
  },
});