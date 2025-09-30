import axios from "axios";

async function getSoil(lat, lon) {
    try {
        const soil = await axios.get(`https://api.openepi.io/soil/type`, {
            params: {
                lat: `${lat}`,
                lon: `${lon}`,
                top_k: 3
            }
        })

        const soilData = soil.data

        return soilData;
    } catch (error) {
        console.log("Soil API error:", error.response?.data || error.message);
        return { error: error.message };
    }
}

export default getSoil;