import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  // Construct the endpoint for Nominatim search
  const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if results were returned
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return res.status(200).json({ lat, lng: lon }); // Return longitude as 'lng'
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
