import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { origin, destination } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  const baseUrl = 'http://router.project-osrm.org/route/v1/driving/';
  const url = `${baseUrl}${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes.length > 0) {
      const distance = data.routes[0].legs[0].distance;
      return res.status(200).json({ distance });
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}