const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/geolocation', async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return res.status(200).json({ lat, lng: lon });
    } else {
      return res.status(404).json({ error: 'No results found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
