const express = require('express');
const router = express.Router();
const dbConnect = require('../lib/dbConnect');
const { Booking, User, Job } = require('../models/Schema');

router.post('/write-booking', async (req, res) => {
  try {
    await dbConnect();
    const {
      userId,
      serviceName,
      phone,
      pickupDate,
      pickupTime,
      pickupAddress,
      dropAddress,
      estimatedPrice,
      status,
      approvals,
    } = req.body;

    if (!userId || !serviceName || !phone || !pickupDate || !pickupTime || !pickupAddress || !dropAddress || !estimatedPrice || !status || approvals === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBooking = new Booking({
      userId,
      serviceName,
      phone,
      pickupDate,
      pickupTime,
      pickupAddress,
      dropAddress,
      estimatedPrice,
      status,
      approvals,
      allocatedDriverPhone: null,
    });



    const savedBooking = await newBooking.save();
    const radius = 5000;

    const nearbyDrivers = await User.find({
      role: 'driver',
      currentLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [pickupAddress.coords.lng, pickupAddress.coords.lat] },
          $maxDistance: radius,
        },
      },
    });

    const jobPromises = nearbyDrivers.map(driver => {
      const newJob = new Job({
        bookingId: savedBooking._id,
        driverId: driver._id,
        vehicleId: driver.vehicleId,
        approvals: 'not approved',
        currentLocation: {
          type: 'Point',
          coordinates: [pickupAddress.coords.lng, pickupAddress.coords.lat],
        },
        jobStatus: 'pending',
        startTime: new Date(),
      });
      return newJob.save();
    });

    await Promise.all(jobPromises);
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
