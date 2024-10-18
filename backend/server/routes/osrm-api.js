const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/route', async (req, res) => {
  const { origin, destination } = req.body;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  const url = `http://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes.length > 0) {
      const distance = data.routes[0].legs[0].distance;
      return res.status(200).json({ distance });
    } else {
      return res.status(404).json({ error: 'No route found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
