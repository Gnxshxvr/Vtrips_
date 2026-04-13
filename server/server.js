const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const tripRoutes = require('./routes/tripRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', tripRoutes);

app.get('/', (req, res) => {
  res.send('VTRIP API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
