import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@services/api";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const translateIt = createAsyncThunk(
  "translateIt", async (text, { rejectWithValue }) => {
    try {
    const response = await apiClient.post("/translate", text);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to translate");
  }
});

const fetchTranslations = createAsyncThunk(
  "translations/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/translations");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const addTranslations = createAsyncThunk(
  "addTranslations", async (translationData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/translations", translationData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add translation");
  }
});

const updateTranslations = createAsyncThunk(
  "updateTranslations", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/translations/${id}`, { updatedData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update translation");
    }
  });

const deleteTranslations = createAsyncThunk(
  "deleteTranslations", async (translationData, { rejectWithValue }) => {
    try {
    const response = await apiClient.delete(`/translations/${translationData.id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete translation");
  }
});

const downloadJSON = createAsyncThunk(
  "translations/downloadJSON", async (key, { rejectWithValue }) => {
  try {
    // If "all", expect JSON (not blob)
    if (key.key === "all") {
      const response = await apiClient.post("/json-download", { key: "all" });

      const allLangData = response.data; // Object like { en: {}, ta: {}, hi: {} }
      const zip = new JSZip();

      for (const [lang, translations] of Object.entries(allLangData)) {
        zip.file(`${lang}.json`, JSON.stringify(translations, null, 2));
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "translations.zip");
    } else {
      // For individual language
      const response = await apiClient.post("/json-download", { key: key.key }, { responseType: "blob" });

      const blob = new Blob([response.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${key.key}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Download failed:", error);
    return rejectWithValue(error.response?.data?.message || "Download failed");
  }
});

export {
  translateIt,
  fetchTranslations,
  addTranslations,
  updateTranslations,
  deleteTranslations,
  downloadJSON,
};
