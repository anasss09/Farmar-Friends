import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import { getCropRecommendation } from "../utils/recommendations/geminiCropRecomendation.js";
import { getIrrigationRecommendation } from "../utils/recommendations/geminiIrrigationRecommendation.js";
import { getPesticideRecommendation } from "../utils/recommendations/geminiPestisitesRecommendation.js";

export const postCropRecommendations = ErrorWrapper(async (req, res, next) => {
    
    try {
        const { N, P, K, ph, temperature, humidity, rainfall } = req.body;
        const crop = await getCropRecommendation(N, P, K, ph, temperature, humidity, rainfall);

        if (!crop) {
            throw new ErrorHandler(400, 'Error in crop responses')
        }

        res.status(200).json({
            success: true,
            message: "Gemini responded successfully",
            recommendation: crop
        });
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message)
    }
});

export const postIrrigationRecommendation = ErrorWrapper(async (req, res, next) => {

    try {
        const { crop, soilMoisture, temperature, rainfall } = req.body;
        const irrigation = await getIrrigationRecommendation({ crop, soilMoisture, temperature, rainfall });

        if (!irrigation) {
            throw new ErrorHandler(400, 'Error in crop responses')
        }

        res.status(200).json({
            success: true,
            message: "Gemini responded successfully",
            recommendation: irrigation
        });
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message)
    }
});

export const postPestisitesRecommendation = ErrorWrapper(async (req, res, next) => {

    try {
        const { crop, pest, severity } = req.body
        const pesticide = await getPesticideRecommendation({ crop, pest, severity });

        if (!pesticide) {
            throw new ErrorHandler(400, 'Error in crop responses')
        }

        res.status(200).json({
            success: true,
            message: "Gemini responded successfully",
            recommendation: pesticide
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});