import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import getWeather from '../utils/API/Weather.js';
import getSoil from "../utils/API/Soil.js";
import Farmer from "../model/farmer.js";

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

        // Update farmer document directly
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
            } // Return updated document
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
        const { soilType, crop, area } = req.body;

        if(!soilType || !crop || !area) {
            throw new ErrorHandler(404, "Requires Soil Type, crop, area");
        }

        const farmer = await Farmer.findOne({ userId: req.user._id })

        if(!farmer) {
            throw new ErrorHandler(404, "Error in finding farmer")
        }

        const state = farmer?.weather?.state
        const country = farmer?.weather?.country
        const location = state + ", " + country;

        if(!location) {
            throw new ErrorHandler(404, 'Location not found in POSTFARMDETAILS')
        }

        const farmData = {
            location: location,
            soilType: soilType,
            crop: crop,
            area: area
        }

        farmer.farm = farmData;
        await farmer.save()

        res.status(200).json({
            success: true,
            message: 'Successfully Stored data',
            farm: farmData
        })

    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message)
    }
})