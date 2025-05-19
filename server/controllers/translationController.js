import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { StatusCodes } from "http-status-codes";
import Translation from "../models/Translation.js";
import { translationClient, targetLangs, langKeys } from "../config/translateCient.js";
import _ from "lodash";

// For resolving __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translateText = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Text is required." });

  try {
    const translations = {};
    for (const langCode of Object.keys(targetLangs)) {
      const [translated] = await translationClient.translate(text, langCode);
      translations[langCode] = translated;
    }
    res.status(StatusCodes.CREATED).json({ original: text, translations });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Translation failed." });
  }
};

const saveTranslation = async (req, res) => {
  try {
    const { key } = req.body;

    const existing = await Translation.findOne({ key });
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        message: `Translation key "${key}" already exists.`,
      });
    }

    await Translation.create(req.body);

    res.status(StatusCodes.CREATED).json({ message: "Saved Successfully" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Saving failed." });
  }
};

const updateTranslation = async (req, res) => {
  try {
    const { updatedData } = req.body;
    const { id } = req.params;

    if (!id || !updatedData) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Data Not Found" });
    }

    const updatedTranslation = await Translation.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedTranslation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Translation not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "Translation updated successfully",
    });
  } catch (error) {
    console.error("Error updating translation:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: error.message });
  }
};

const deleteTranslation = async (req, res) => {
  const { id } = req.params;

  const deletedData = await Translation.findByIdAndDelete(id);

  if (!deletedData) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Data Not Found" });
  }

  res.status(StatusCodes.OK).json({ msg: "Success! Data removed." });
};

const getAllTranslations = async (req, res) => {
  try {
    const data = await Translation.find({}, "-createdAt -updatedAt -__v").sort({ createdAt: -1 });

    const formattedData = data.map((doc) => ({
      id: doc._id,
      key: doc.key,
      en: doc.en,
      ta: doc.ta,
      hi: doc.hi,
      te: doc.te,
      kn: doc.kn,
      ml: doc.ml,
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Fetch failed." });
  }
};

const downloadJSON = async (req, res) => {
  try {
    const { key } = req.body.key;

    const translations = await Translation.find({}, "-_id -__v -createdAt -updatedAt");

    if (!translations.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "No translations found" });
    }

    // Case 1: Download all
    if (key === "all") {
      const tempDir = path.join(__dirname, "../temp-downloads");

      // Create folder if not exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      // Write one file per language
      for (const lang of Object.keys(langKeys)) {
        const langData = {};
        translations.forEach((item) => {
          langData[item.key] = item[lang];
        });

        const filePath = path.join(tempDir, `${lang}.json`);
        fs.writeFileSync(filePath, JSON.stringify(langData, null, 2), "utf-8");
      }

      // Send the folder as a zip file
      const archiver = await import("archiver");
      const archive = archiver.default("zip", { zlib: { level: 9 } });
      const zipPath = path.join(tempDir, "all-translations.zip");
      const output = fs.createWriteStream(zipPath);

      archive.pipe(output);

      Object.keys(langKeys).forEach((lang) => {
        const filePath = path.join(tempDir, `${lang}.json`);
        archive.file(filePath, { name: `${lang}.json` });
      });

      await archive.finalize();

      output.on("close", () => {
        res.download(zipPath, "translations.zip", () => {
          // Clean up
          fs.rmSync(tempDir, { recursive: true, force: true });
        });
      });
    } else {
      // Case 2: Single language
      if (!langKeys[key]) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid language key" });
      }

      const langData = {};
      translations.forEach((item) => {
        langData[item.key] = item[key];
      });

      const fileContent = JSON.stringify(langData, null, 2);
      const fileName = `${key}.json`;

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.status(StatusCodes.OK).send(fileContent);
    }
  } catch (error) {
    console.error("Download error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to download files" });
  }
};

export {
  translateText,
  saveTranslation,
  updateTranslation,
  deleteTranslation,
  getAllTranslations,
  downloadJSON
}