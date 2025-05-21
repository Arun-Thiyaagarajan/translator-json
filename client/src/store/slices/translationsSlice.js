// slices/translationsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchTranslations } from "@store/translationThunks";

const translationsSlice = createSlice({
  name: "translations",
  initialState: {
    translationsData: [],
    selectedTranslation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedTranslation: (state, action) => {
      state.selectedTranslation = action.payload;
    },
    clearSelected: (state) => {
      state.selectedTranslation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTranslations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTranslations.fulfilled, (state, action) => {
        state.loading = false;
        state.translationsData = action.payload;
      })
      .addCase(fetchTranslations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTranslation } = translationsSlice.actions;
export default translationsSlice.reducer;