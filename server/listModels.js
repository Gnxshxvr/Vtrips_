require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;
const fs = require('fs');

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    fs.writeFileSync('../models.txt', JSON.stringify(data, null, 2));
    console.log("Done");
  } catch(e) {
    console.error(e);
  }
}
run();
