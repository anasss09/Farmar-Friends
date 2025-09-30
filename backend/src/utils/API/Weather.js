import axios from "axios";
import kelvinToCelsius from "../ConvertTemp.js";

const apikey = process.env.WEATHER_API_KEY;

async function getWeather(state, country) {
  try {
    // 1️⃣ Geocoding API
    const geoRes = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: `${state},${country}`,
        limit: 5,
        appid: apikey
      }
    });

    const geoData = geoRes.data;
    if (!geoData[0]) throw new Error("Location not found");

    const { lat, lon } = geoData[0];

    // 2️⃣ Weather API
    const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat,
        lon,
        appid: apikey
      }
    });

    const weatherData = weatherRes.data;
    weatherData.main.temp = kelvinToCelsius(weatherData.main.temp);


    return weatherData;

  } catch (err) {
    console.error(err.message);
    return { error: err.message };
  }
}

export default getWeather;
