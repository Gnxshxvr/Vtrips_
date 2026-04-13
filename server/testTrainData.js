require('dotenv').config(); // Load environment variables from .env if available
const { getTrainSchedules } = require('./services/trainDataFetch');

// Sample parameters for testing
const testOrigin = 'NDLS'; // New Delhi Station Code
const testDestination = 'MMCT'; // Mumbai Central Station Code
const testDate = '2025-01-15'; // Using a future date layout compatible with IRCTC RapidAPI (usually YYYY-MM-DD or DD/MM/YYYY)

console.log(`\n======================================================`);
console.log(`[Test] Train Fetch Service Initialization test`);
console.log(`======================================================`);
console.log(`Executing request:`);
console.log(`Origin: ${testOrigin}`);
console.log(`Destination: ${testDestination}`);
console.log(`Date: ${testDate}\n`);

// Adding a quick check for API Key
if (!process.env.RAPIDAPI_KEY) {
    console.warn(`[WARNING] process.env.RAPIDAPI_KEY is not set. RapidAPI will likely return 401 Unauthorized unless the API is completely open or mocked.`);
}

getTrainSchedules(testOrigin, testDestination, testDate)
    .then(trains => {
        if (trains && trains.length > 0) {
            console.log('\n✅ [Success] Successfully retrieved train data. Structured format:\n');
            console.table(trains);
        } else {
            console.log('\n⚠️ [Notice] Service successfully executed, but no train data was returned or API was unauthorized.');
            console.log('Check your RAPIDAPI_KEY and endpoint validity.');
        }
        console.log(`\n======================================================\n`);
    })
    .catch(error => {
        console.error('\n❌ [Error] Test script failed unexpectedly:', error.message);
    });
