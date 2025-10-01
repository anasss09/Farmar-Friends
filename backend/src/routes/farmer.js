import express from 'express'
import { postAddForum, postDeleteForum, postFarmDetails, postSoilDetails, postUpdateForum, postWeatherDetails } from '../controller/farmer.js';
import upload from '../utils/multer.js'

const router = express.Router()

// API's
router.post('/weatherData', postWeatherDetails) 
router.post('/soil', postSoilDetails)
router.post('/farm', postFarmDetails)

// CRUD on Forum Post
router.post('/addForum', upload.array("images", 12) , postAddForum)
router.post('/updateForum', upload.array("images", 12) , postUpdateForum);
router.post('/deleteForum', postDeleteForum);

export default router;  