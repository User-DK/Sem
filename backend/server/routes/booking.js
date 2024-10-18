const express = require('express');
const router = express.Router();
const dbConnect = require('../lib/dbConnect');
const { Booking } = require('../models/Schema');

router.get('/bookings', async (req, res) => {
  try {
    await dbConnect();
    const { userId } = req.query;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: userId missing' });
    }
    const bookings = await Booking.find({ userId }).populate('userId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;