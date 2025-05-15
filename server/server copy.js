import express from "express";
import cors from "cors";
import { v2 as translate } from "@google-cloud/translate";
import path from "path";
import { config } from "dotenv";

config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Load service account key path from env or hardcoded fallback
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Create Translate client with service account
const translationClient = new translate.Translate({
  keyFilename: keyPath,
});

const targetLangs = {
  ta: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
};

app.post("/translate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const translations = {};

    for (const [langCode, langName] of Object.entries(targetLangs)) {
      const [translation] = await translationClient.translate(text, langCode);
      translations[langCode] = translation;
    }

    res.json({ original: text, translations });
  } catch (error) {
    console.error("Translation Error:", error.message);
    res.status(500).json({ error: "Translation failed." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Translation server running at http://localhost:${PORT}`);
});