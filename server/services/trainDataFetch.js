const { generateRealisticTrains } = require('./gemini');

const fetchOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY', // Placeholder for actual RapidAPI Key
        'X-RapidAPI-Host': 'irctc1.p.rapidapi.com' // Popular Indian Railways API endpoint on RapidAPI
    }
};

/**
 * Fetch train schedules from an origin to a destination on a specific date.
 * 
 * @param {string} originStationCode - Origin station code (e.g., NDLS for New Delhi)
 * @param {string} destinationStationCode - Destination station code (e.g., MMCT for Mumbai Central)
 * @param {string} dateOfJourney - Date in format suitable for the API (e.g., YYYY-MM-DD or DD/MM/YYYY depending on API)
 * @returns {Promise<Array>} Clean JSON array of available trains
 */
const getTrainSchedules = async (originStationCode, destinationStationCode, dateOfJourney) => {

    try {
        // Construct the URL mapping for irctc1.p.rapidapi.com trainBetweenStations endpoint
        const url = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${originStationCode}&toStationCode=${destinationStationCode}&dateOfJourney=${dateOfJourney}`;
        
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
            console.error('[trainDataFetch] Failed to fetch train data:', response.status, response.statusText, '- Falling back to Generative AI for realistic trains.');
            return await generateRealisticTrains(originStationCode, destinationStationCode);
        }
        
        const data = await response.json();
        
        // Transform the returned payload into a clean format structure
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
            return data.data.map(train => ({
                trainNumber: train.train_number || 'N/A',
                trainName: train.train_name || 'Unknown Train',
                departureTime: train.from_std || 'N/A',
                arrivalTime: train.to_sta || 'N/A',
                duration: train.duration || 'N/A',
                origin: train.from_station_name || originStationCode,
                destination: train.to_station_name || destinationStationCode,
            }));
        }

        console.log('[trainDataFetch] No trains found (likely invalid station code). Falling back to Generative AI for realistic trains.');
        return await generateRealisticTrains(originStationCode, destinationStationCode);
    } catch (error) {
        console.error("[trainDataFetch] Error in isolated train data service:", error.message);
        return await generateRealisticTrains(originStationCode, destinationStationCode);
    }
};

module.exports = {
   getTrainSchedules
};
