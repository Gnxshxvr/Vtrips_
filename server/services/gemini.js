const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateAiPlan = async (tripParams) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Recommend using 1.5-flash or 1.5-pro, 1.5-flash is fast and cheap
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const {
    source = 'VIT Chennai',
    destination,
    budget,
    days,
    travelType,
    preferences = [],
    transportMode,
    stayType,
    foodPreference
  } = tripParams;

  const prompt = `Act as a smart travel planner for Indian college students. 
Generate a highly budget-optimized travel plan from ${source} to ${destination} for ${days} days within ₹${budget}. 
User Preferences:
- Travel Type: ${travelType || 'Solo'}
- Focus (Preferences): ${Array.isArray(preferences) ? preferences.join(', ') : preferences}
- Preferred Transport: ${transportMode || 'Any'}
- Stay Type: ${stayType || 'Budget'}
- Food Preference: ${foodPreference || 'Any'}

You must respond ONLY with a valid JSON object matching the detailed structure below. Do not include markdown code blocks like \`\`\`json. Just raw valid JSON. Ensure it is strictly valid JSON.

Structure:
{
  "summary": {
    "title": "Short catchy title",
    "destinationCity": "Exact destination city name only",
    "budgetEstimate": 0,
    "highlights": ["highlight1", "highlight2"]
  },
  "budgetBreakdown": {
    "transport": 0,
    "stay": 0,
    "food": 0,
    "activities": 0,
    "miscellaneous": 0
  },
  "detailedItinerary": [
    {
      "day": 1,
      "theme": "Theme for the day",
      "activities": [
        { "time": "Morning", "description": "...", "costEst": 0 },
        { "time": "Afternoon", "description": "...", "costEst": 0 },
        { "time": "Evening", "description": "...", "costEst": 0 }
      ]
    }
  ],
  "travelSuggestions": "Tips on transport mode, e.g. overnight bus",
  "staySuggestions": "Affordable hostel/hotel ideas",
  "studentTips": ["tip1", "tip2"]
}`;

  let text = "";
  let success = false;
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
      success = true;
      break;
    } catch (err) {
      lastError = err;
      // If 503 Overloaded error, wait and try again
      if (err.status === 503 || (err.message && err.message.includes('503'))) {
        if (attempt < 3) {
          console.warn(`Gemini 503 error (high demand). Wait and retry attempt ${attempt}...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 5000)); // 5s, 10s wait
        }
      } else {
        break; // Break loop for other errors
      }
    }
  }

  if (!success) {
    console.error('Gemini processing error after retries:', lastError);
    throw new Error(lastError?.message || 'Failed to call Gemini response due to high demand.');
  }
  
  try {
    // Extract JSON block using regex to avoid trailing text issues causing "Unexpected non-whitespace character"
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
       text = jsonMatch[0];
    } else {
       text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    }
    
    return JSON.parse(text);
  } catch (err) {
    console.error('Gemini parse error:', err);
    throw new Error('Failed to parse Gemini response.');
  }
};

const generateRealisticTrains = async (origin, destination) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Find 3 realistic Indian Railway train connections from ${origin} to ${destination}.
If there are no direct trains, guess the most likely realistic connecting train routes.
Return ONLY a valid JSON array of objects with realistic historical timings and legitimate train names/numbers. 
Format exactly like this strictly valid JSON array:
[
  {
    "trainNumber": "12615",
    "trainName": "Grand Trunk Express",
    "departureTime": "17:00",
    "arrivalTime": "06:30",
    "duration": "13h 30m",
    "origin": "${origin}",
    "destination": "${destination}"
  }
]
No markdown blocks or wrapping code. Just the raw JSON array.`;

  let text = "";
  let success = false;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
      success = true;
      break;
    } catch (err) {
      if (err.status === 503 || (err.message && err.message.includes('503'))) {
        if (attempt < 3) {
          console.warn(`Train AI 503 error. Wait and retry attempt ${attempt}...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 4000));
        }
      } else {
        console.error('Gemini train fallback failed on attempt:', err);
        break;
      }
    }
  }

  if (!success) return [];

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) text = jsonMatch[0];
    else text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    console.error('Gemini train fallback parse failed:', err);
    return [];
  }
};

module.exports = { generateAiPlan, generateRealisticTrains };
