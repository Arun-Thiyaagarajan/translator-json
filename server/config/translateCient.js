import { v2 as translate } from "@google-cloud/translate";
import { config } from "dotenv";

config();

const base64String = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64;
const jsonString = Buffer.from(base64String, "base64").toString("utf-8");
const serviceAccount = JSON.parse(jsonString);

export const translationClient = new translate.Translate({
  credentials: serviceAccount,
  projectId: serviceAccount.project_id,
});

export const targetLangs = {
  ta: "Tamil",
  hi: "Hindi",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
};

export const langKeys = {
  en: "en",
  ta: "ta",
  hi: "hi",
  te: "te",
  kn: "kn",
  ml: "ml",
};
