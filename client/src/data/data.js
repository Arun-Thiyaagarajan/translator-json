import { nanoid } from "@reduxjs/toolkit";
import { ELanguages } from "@enums/index";

export const languages = [
  {
    id: nanoid(),
    lang: ELanguages.english,
    key: "en",
  },
  {
    id: nanoid(),
    lang: ELanguages.tamil,
    key: "ta",
  },
  {
    id: nanoid(),
    lang: ELanguages.malayalam,
    key: "ml",
  },
  {
    id: nanoid(),
    lang: ELanguages.telugu,
    key: "te",
  },
  {
    id: nanoid(),
    lang: ELanguages.kannada,
    key: "kn",
  },
  {
    id: nanoid(),
    lang: ELanguages.hindi,
    key: "hi",
  },
];