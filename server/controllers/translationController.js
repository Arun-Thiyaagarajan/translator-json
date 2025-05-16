import Translation from "../models/Translation.js";
import { translationClient, targetLangs } from "../config/translateCient.js";
import { StatusCodes } from "http-status-codes";

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
    await Translation.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Saved Successfully' });
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
      data: updatedTranslation,
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

export {
  translateText,
  saveTranslation,
  updateTranslation,
  deleteTranslation,
  getAllTranslations
}