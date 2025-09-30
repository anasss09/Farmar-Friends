import express from 'express'
import { postFarmDetails, postSoilDetails, postWeatherDetails } from '../controller/farmer.js';

const router = express.Router()

router.post('/weatherData', postWeatherDetails) 
router.post('/soil', postSoilDetails)
router.post('/farm', postFarmDetails)

export default router;