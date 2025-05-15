import { v2 as translate } from "@google-cloud/translate";
import dotenv from "dotenv";

dotenv.config();

// Create Translate client with service account
export const translationClient = new translate.Translate({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const targetLangs = {
  ta: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
};
