// const address = 'Naigaon, Vasai, Maharashtra, India';
// const addresses = [
//   "Mumbai, Maharashtra, India",
//   "Bangalore, Karnataka, India",
//   "Chennai, Tamil Nadu, India",
//   "Hyderabad, Telangana, India",
//   "Kolkata, West Bengal, India",
//   "New Delhi, Delhi, India",
//   "Pune, Maharashtra, India",
//   "Ahmedabad, Gujarat, India",
//   "Jaipur, Rajasthan, India",
//   "Lucknow, Uttar Pradesh, India"
// ];
// const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;

// console.log(endpoint);


// const origin = { lat: 19.3510925, lng: 72.8465229 };
// const destination = { lat: 18.915091, lng: 72.8259691 };
// const baseUrl = 'http://router.project-osrm.org/route/v1/driving/';
// const url = `${baseUrl}${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;

// console.log(url);

// import dbConnect from '../../lib/dbConnect';
// import { User } from '../../models/Schema';
// import bcrypt from 'bcrypt';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { email, password } = req.body;

//   try {
//     await dbConnect();

//     // Check if the user exists
//     const existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       return res.status(400).json({ error: 'User does not exist' });
//     }

//     // Compare the provided password with the stored hashed password
//     const isPasswordValid = await bcrypt.compare(password, existingUser.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Respond with the authenticated user (excluding password and salt)
//     res.status(200).json({
//       _id: existingUser._id,
//       name: existingUser.name,
//       email: existingUser.email,
//       phone: existingUser.phone,
//       address: existingUser.address,
//       role: existingUser.role,
//       createdAt: existingUser.createdAt,
//       updatedAt: existingUser.updatedAt,
//     });
//   } catch (error) {
//     console.error('Error signing in user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

// (async () => {
//   handler({
//     method: 'POST',
//     body: {
//       email: 'Daivik01@gmail.com',
//       password: 'Daivik01',
//     },
//   }, {
//     status: (code) => ({
//       json: (data) => console.log(code, data),
//     }),
//   });
// })();


// import { randomBytes } from 'crypto';

// console.log(randomBytes(64).toString('hex'));