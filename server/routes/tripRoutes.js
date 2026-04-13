const express = require('express');
const router = express.Router();
const { generateTripPlan } = require('../controllers/tripController');

router.post('/generate-trip', generateTripPlan);

module.exports = router;
