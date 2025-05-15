import Translation from "../models/Translation.js";
import { translationClient, targetLangs } from "../config/translateCient.js";

export const translateText = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required." });

  try {
    const translations = {};
    for (const langCode of Object.keys(targetLangs)) {
      const [translated] = await translationClient.translate(text, langCode);
      translations[langCode] = translated;
    }
    res.json({ original: text, translations });
  } catch (err) {
    res.status(500).json({ error: "Translation failed." });
  }
};

export const saveTranslation = async (req, res) => {
  try {
    const saved = await Translation.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Saving failed." });
  }
};

export const getAllTranslations = async (req, res) => {
  try {
    const data = await Translation.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed." });
  }
};