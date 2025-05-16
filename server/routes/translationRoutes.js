import { Router } from "express";
import { translateText, saveTranslation, getAllTranslations, updateTranslation, deleteTranslation } from "../controllers/translationController.js";

const router = Router();

router.post("/translate", translateText);
router
  .route("/translations")
  .post(saveTranslation)
  .get(getAllTranslations);
router
  .route("/translations/:id")
  .patch(updateTranslation)
  .delete(deleteTranslation);

export default router;