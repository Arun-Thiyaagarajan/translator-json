import { Router } from "express";
import { translateText, saveTranslation, getAllTranslations } from "../controllers/translationController.js";

const router = Router();

router.post("/translate", translateText);
router.post("/save", saveTranslation);
router.get("/translations", getAllTranslations);

export default router;