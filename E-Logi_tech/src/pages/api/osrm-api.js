import { NextApiRequest, NextApiResponse } from 'next';
import osrmClient from 'osrm-client';

const osrm = new osrmClient('https://router.project-osrm.org');

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentPosition, destination } = req.body;

  if (!currentPosition || !destination) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  osrm.route(
    {
      coordinates: [
        [currentPosition.lng, currentPosition.lat],
        [destination.lng, destination.lat],
      ],
      overview: 'full',
      steps: false,
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Routing error', details: err.message });
      }
      res.json({ route: result.routes[0].geometry.coordinates });
    }
  );
}