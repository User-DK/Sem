// import dbConnect from '../../lib/dbConnect';
// import { User, Booking } from '../../models/Schema';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   // Connect to the database
//   await dbConnect();


//   try {

//     const {
//       userId,
//       serviceName,
//       phone,
//       pickupDate,
//       pickupAddress,
//       dropAddress,
//       estimatedPrice,
//       approvals,
//       status,
//     } = req.body;

//     // Validate required fields
//     if (!serviceName || !phone || !pickupDate || !pickupAddress || !dropAddress) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Create a new booking
//     const newBooking = new Booking({
//       userId: new mongoose.Types.ObjectId(userId), // Ensure userId is an ObjectId
//       serviceName,
//       phone,
//       pickupDate,
//       pickupAddress,
//       dropAddress,
//       estimatedPrice,
//       approvals,
//       status,
//       allocatedDriverPhone: null,
//       cost: estimatedPrice
//     });

//     // Save the booking in the database
//     const savedBooking = await newBooking.save();

//     // Respond with the saved booking
//     res.status(200).json(savedBooking);
//   } catch (error) {
//     console.error('Error saving booking:', error);
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ error: 'Invalid or expired token' });
//     }
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
import dbConnect from '../../lib/dbConnect';
import { Booking, Job, User } from '../../models/Schema';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Validate required fields
    if (!userId || !serviceName || !phone || !pickupDate || !pickupTime || !pickupAddress || !dropAddress || !estimatedPrice || !status || approvals === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new booking
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

    // Save the booking in the database
    const savedBooking = await newBooking.save();

    // Define the radius in meters (e.g., 5000 meters = 5 kilometers)
    const radius = 5000;

    // Find nearby drivers based on the pickup coordinates
    const nearbyDrivers = await User.find({
      role: 'driver',
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupAddress.coords.lng, pickupAddress.coords.lat]
          },
          $maxDistance: radius
        }
      }
    });

    // Create job entries for nearby drivers
    const jobPromises = nearbyDrivers.map(driver => {
      const newJob = new Job({
        bookingId: savedBooking._id,
        driverId: driver._id,
        vehicleId: driver.vehicleId,
        approvals: 'not approved',
        currentLocation: {
          type: 'Point',
          coordinates: [pickupAddress.coords.lng, pickupAddress.coords.lat]
        },
        jobStatus: 'pending',
        startTime: new Date(),
      });

      return newJob.save();
    });

    await Promise.all(jobPromises);

    // Respond with the saved booking
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}