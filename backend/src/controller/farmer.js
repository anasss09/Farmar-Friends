import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import getWeather from '../utils/API/Weather.js';
import getSoil from "../utils/API/Soil.js";
import Farmer from "../model/farmer.js";
import { uploadBatchOnCloudinary } from "../utils/upload.js";

export const postWeatherDetails = ErrorWrapper(async (req, res) => {
    try {
        const { state, country } = req.body;

        if (!state || !country) {
            throw new ErrorHandler(400, 'State and country are required');
        }

        const weatherDetails = await getWeather(state, country);

        if (!weatherDetails) {
            throw new ErrorHandler(400, 'Error in Weather API');
        }

        const user = req.user;

        // Check if farmer profile already exists
        let farmer = await Farmer.findOne({ userId: user._id });

        const weatherData = {
            state,
            country,
            lat: weatherDetails.coord.lat,
            lon: weatherDetails.coord.lon,
            monsoon: weatherDetails.weather[0].main,
            humidity: weatherDetails.main.humidity,
            temperature: weatherDetails.main.temp,
        };

        if (farmer) {
            // Update existing farmer's weather data
            farmer.weather = weatherData;
            await farmer.save();
        } else {
            // Create new farmer profile
            farmer = await Farmer.create({
                userId: user._id,
                weather: weatherData,
                soil: {
                    soil_type: null,
                    probability: null
                },
                farm: {
                    location: "",
                    soilType: "",
                    crops: [],
                    area: 0
                },
                forumPost: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Successfully Fetched Weather Data',
            weather: farmer.weather,
            farmerId: farmer._id
        });
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
});

export const postSoilDetails = ErrorWrapper(async (req, res, next) => {
    try {
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            throw new ErrorHandler(400, "Latitude and longitude are required");
        }

        const soilData = await getSoil(lat, lon);

        if (!soilData || !soilData.properties || !soilData.properties.probabilities) {
            throw new ErrorHandler(400, "Invalid soil data received from API");
        }

        const user = req.user;

        const soilDetails = {
            soil_type: soilData.properties.probabilities[0].soil_type,
            probability: soilData.properties.probabilities[0].probability,
        };

        const updatedFarmer = await Farmer.findOneAndUpdate(
            { userId: user._id },
            {
                $set: {
                    soil: soilDetails
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFarmer) {
            throw new ErrorHandler(404, 'Farmer profile not found. Please create a farmer profile first.');
        }

        res.status(200).json({
            success: true,
            message: 'Successfully Fetched and Updated Soil Details',
            farmer: updatedFarmer.soil
        });
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
});

export const postFarmDetails = ErrorWrapper(async (req, res, next) => {
    try {
        const { soilType, crops, area } = req.body;

        const requiredField = ['soilType', 'crops', 'area']
        const incomingField = Object.keys(req.body);
        const missingField = requiredField.filter(field => !incomingField.includes(field))

        if (missingField.length > 0) {
            throw new ErrorHandler(400, `Fills these ${missingField} fields`)
        }

        const farmer = await Farmer.findOne({ userId: req.user._id })

        if (!farmer) {
            throw new ErrorHandler(404, "Error in finding farmer")
        }

        const state = farmer?.weather?.state
        const country = farmer?.weather?.country
        const location = state + ", " + country;

        if (!location) {
            throw new ErrorHandler(404, 'Location not found in POSTFARMDETAILS')
        }

        const farmData = {
            location: location,
            soilType: soilType,
            crops,
            area: area
        }

        farmer.farm = farmData;
        await farmer.save()

        res.status(200).json({
            success: true,
            message: 'Successfully Stored data',
            farm: farmer.farm
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message)
    }
})

export const postAddForum = ErrorWrapper(async (req, res, next) => {
    try {
        const { message } = req.body;
        const user = req.user;
        const username = user.name;
        const userImage = user.image;

        if (!message) {
            throw new ErrorHandler(404, "Enter message")
        }

        const farmer = await Farmer.findOne({ userId: user._id })

        if (!farmer) {
            throw new ErrorHandler(404, 'Error in Forum, Farmer not found')
        }

        if (farmer.userId.toString() !== user._id.toString()) {
            throw new ErrorHandler(401, 'You are not Authorised to perform this task')
        }

        const response = await uploadBatchOnCloudinary(req.files);
        const imageUrl = []

        for (let i = 0; i < response.length; i++) {
            imageUrl.push({
                url: response[i].url
            })
        }

        const forumData = {
            username: username,
            userImage: userImage,
            message: message,
            farmerId: farmer.userId,
            images: imageUrl
        }

        farmer.forumPost.push(forumData);
        await farmer.save()

        res.status(200).json({
            success: true,
            message: 'Message upload Successfully',
            Farmer_Forum: farmer.forumPost
        });

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message)
    }
})

export const postUpdateForum = ErrorWrapper(async (req, res, next) => {
    try {
        const { forumId, message } = req.body;
        const user = req.user;

        if (!forumId) {
            throw new ErrorHandler(404, "Forum Id not found, please provide valid ID");
        }
        if (!message) {
            throw new ErrorHandler(404, "Message not received, please type a valid message");
        }

        const farmer = await Farmer.findOne({ userId: user._id });

        if (!farmer) {
            throw new ErrorHandler(404, "Error in Forum, Farmer not found");
        }

        if (farmer.userId.toString() !== user._id.toString()) {
            throw new ErrorHandler(401, "You are not Authorised to perform this task");
        }

        const forum = farmer.forumPost.id(forumId);
        if (!forum) {
            throw new ErrorHandler(404, "Forum post not found");
        }

        let imageUrl = forum.images;
        if (req.files && req.files.length > 0) {
            const response = await uploadBatchOnCloudinary(req.files);
            imageUrl = response.map((file) => ({ url: file.url }));
        }

        forum.message = message;
        forum.images = imageUrl;
        forum.username = user.name;
        forum.userImage = user.image;

        await farmer.save();

        res.status(200).json({
            success: true,
            message: "Message updated successfully",
            updatedForum: forum,
        });
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
});

export const postDeleteForum = ErrorWrapper(async (req, res, next) => {
    try {
        const { forumId } = req.body;
        const user = req.user

        if (!forumId) {
            throw new ErrorHandler(404, "Id not found")
        }

        const farmer = await Farmer.findOne({ userId: user._id })
        if (!farmer) {
            throw new ErrorHandler(404, "Farmer not found in MongoDB")
        }

        if (farmer.userId.toString() !== user._id.toString()) {
            throw new ErrorHandler(401, "You are not Authorised to perform this task");
        }

        const forum = farmer.forumPost.id(forumId);
        if (!forum) {
            throw new ErrorHandler(404, "Forum not exist !!")
        }

        forum.deleteOne();
        await farmer.save();

        res.status(200).json({
            success: true,
            message: "Forum post deleted successfully",
        });
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message)
    }
})