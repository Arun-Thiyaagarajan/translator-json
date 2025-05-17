import mongoose from "mongoose";

const TranslationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    en: String,
    ta: String,
    hi: String,
    te: String,
    kn: String,
    ml: String,
  },
  { timestamps: true }
);

export default mongoose.model("Translation", TranslationSchema);