import express from "express";
import { postCropRecommendations, postIrrigationRecommendation, postPestisitesRecommendation } from "../controller/recommendations.js";

const router = express.Router();

router.post('/crop', postCropRecommendations);
router.post('/irrigation', postIrrigationRecommendation);
router.post("/pesticide", postPestisitesRecommendation);

export default router;