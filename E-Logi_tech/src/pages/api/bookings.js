import dbConnect from '../../lib/dbConnect';
import { Booking } from '../../models/Schema';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Expect userId to be sent via the query parameters (or body)
    const { userId } = req.query; // Or req.body if POST request

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: userId missing' });
    }

    // Fetch bookings that belong to this user
    const bookings = await Booking.find({ userId }).populate('userId'); // Populate user info if needed

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
