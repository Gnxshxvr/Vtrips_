const { generateAiPlan } = require('../services/gemini');
const { getTrainSchedules } = require('../services/trainDataFetch');

const generateTripPlan = async (req, res) => {
  try {
    const tripParams = req.body;
    
    // Call Gemini API service
    const tripPlan = await generateAiPlan(tripParams);
    
    // Attempt to fetch train data as an enhancement
    if (tripParams.transportMode === 'Train' || tripParams.transportMode === 'Any') {
      try {
        const testDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Map common cities to valid IRCTC station codes to ensure RapidAPI works instead of always falling back
        const cityToStation = {
          'chennai': 'MAS',
          'vit chennai': 'MAS',
          'delhi': 'NDLS',
          'mumbai': 'MMCT',
          'goa': 'MAO',
          'bangalore': 'SBC',
          'bengaluru': 'SBC',
          'hyderabad': 'SC',
          'kolkata': 'HWH',
          'pune': 'PUNE',
          'ooty': 'UAM',
          'pondicherry': 'PDY',
          'munnar': 'ERN' // Nearest major valid railway station
        };
        
        const getCode = (place) => {
           const p = place.toLowerCase();
           for (const [city, code] of Object.entries(cityToStation)) {
              if (p.includes(city)) return code;
           }
           // Fallback to first 4 chars if not found
           return place.substring(0, 4).toUpperCase();
        };

        const srcCode = getCode(tripParams.source);
        const destCode = getCode(tripParams.destination);

        const trains = await getTrainSchedules(srcCode, destCode, testDate);
        if (trains && trains.length > 0) {
           tripPlan.trainDetails = trains;
        }
      } catch (err) {
        console.error("Train fetch non-fatal error:", err.message);
      }
    }
    
    res.status(200).json(tripPlan);
  } catch (error) {
    console.error('Error generating trip:', error);
    res.status(500).json({ error: 'Failed to generate trip plan', details: error.message });
  }
};

module.exports = {
  generateTripPlan
};
