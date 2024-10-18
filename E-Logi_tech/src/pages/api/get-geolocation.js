// src/app/api/job/[jobId].js
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect'; // Ensure this points correctly to your dbConnect utility
import Job from '../../../models/Job';

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  const { jobId } = req.query;

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currentLocation } = req.body;

    const job = await Job.findOneAndUpdate(
      { bookingId: jobId },
      { currentLocation },
      { new: true } // Return the updated document
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ message: 'Location updated successfully', job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}