// // 'use client';

// // // Ensure this is a client component
// // import React, { useEffect, useState } from 'react';
// // import { useSearchParams } from 'next/navigation';
// // import { Box, Button, TextField, Typography } from '@mui/material';
// // import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript } from '@react-google-maps/api';

// // const containerStyle = {
// //   width: '100%',
// //   height: '400px',
// // };

// // // Replace with your Google Maps API key
// // const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

// // const RouteTracking = () => {
// //   const searchParams = useSearchParams();
// //   const jobId = searchParams.get('jobId');
// //   const plat = searchParams.get('plat');
// //   const plng = searchParams.get('plng');
// //   const dlat = searchParams.get('dlat');
// //   const dlng = searchParams.get('dlng');
// //   const status = searchParams.get('status');

// //   const [response, setResponse] = useState<google.maps.DirectionsResult | null>(null);
// //   const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
// //   const [destination, setDestination] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

// //   useEffect(() => {
// //     if (status === 'enroute to pickup') {
// //       setDestination({ lat: Number(plat), lng: Number(plng) });
// //     } else if (status === 'enroute to drop') {
// //       setDestination({ lat: Number(dlat), lng: Number(dlng) });
// //     } else {
// //       console.log('No valid route found');
// //     }
// //   }, [status, plat, plng, dlat, dlng]);

// //   useEffect(() => {
// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         setCurrentPosition({
// //           lat: position.coords.latitude,
// //           lng: position.coords.longitude,
// //         });
// //       },
// //       (error) => {
// //         console.error('Error getting location:', error);
// //       },
// //       {
// //         enableHighAccuracy: true,
// //         timeout: 5000,
// //         maximumAge: 0,
// //       }
// //     );
// //   }, []);

// //   const directionsCallback = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
// //     if (status === 'OK') {
// //       setResponse(result);
// //     } else {
// //       console.log('Directions request failed due to ', status);
// //     }
// //   };

// //   if (!destination.lat || !destination.lng) {
// //     return (
// //       <Box sx={{ p: 4 }}>
// //         <Typography variant="h4" component="h1">
// //           No Current Delivery
// //         </Typography>
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box sx={{ p: 4 }}>
// //       <Typography variant="h4" gutterBottom>
// //         Route Tracking
// //       </Typography>

// //       {/* Google Map */}
// //       <LoadScript googleMapsApiKey={googleMapsApiKey}>
// //         <GoogleMap mapContainerStyle={containerStyle} zoom={14} center={currentPosition || destination}>
// //           {currentPosition && destination && (
// //             <DirectionsService
// //               options={{
// //                 destination: destination,
// //                 origin: currentPosition,
// //                 travelMode: google.maps.TravelMode.DRIVING,
// //               }}
// //               callback={directionsCallback}
// //             />
// //           )}

// //           {response && (
// //             <DirectionsRenderer
// //               options={{
// //                 directions: response,
// //               }}
// //             />
// //           )}
// //         </GoogleMap>
// //       </LoadScript>
// //     </Box>
// //   );
// // };

// // export default function Page(): React.JSX.Element {
// //   return <RouteTracking />;
// // }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Box, Button, TextField, Typography } from '@mui/material';
// import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

// import 'leaflet/dist/leaflet.css';

// import L from 'leaflet';
// import osrmClient from 'osrm-client'; // For routing

// const osrm = new osrmClient('https://router.project-osrm.org');

// const containerStyle = {
//   width: '100%',
//   height: '400px',
// };

// const RouteTracking = () => {
//   const searchParams = useSearchParams();
//   const jobId = searchParams.get('jobId');
//   const plat = searchParams.get('plat');
//   const plng = searchParams.get('plng');
//   const dlat = searchParams.get('dlat');
//   const dlng = searchParams.get('dlng');
//   const initialStatus = searchParams.get('status');

//   const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
//   const [destination, setDestination] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
//   const [route, setRoute] = useState<any>(null); // Store the calculated route
//   const [status, setStatus] = useState(initialStatus || 'enroute to pickup');

//   // Handle geolocation and routing logic
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentPosition({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       (error) => {
//         console.error('Error getting location:', error);
//       }
//     );
//   }, []);

//   useEffect(() => {
//     if (status === 'enroute to pickup') {
//       setDestination({ lat: Number(plat), lng: Number(plng) });
//     } else if (status === 'enroute to drop') {
//       setDestination({ lat: Number(dlat), lng: Number(dlng) });
//     }
//   }, [status, plat, plng, dlat, dlng]);

//   const handleGetDirections = () => {
//     if (currentPosition && destination) {
//       osrm.route(
//         {
//           coordinates: [
//             [currentPosition.lng, currentPosition.lat],
//             [destination.lng, destination.lat],
//           ],
//           overview: 'full',
//           steps: false,
//         },
//         (err, result) => {
//           if (err) {
//             console.error('Routing error:', err);
//           } else {
//             setRoute(result.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
//           }
//         }
//       );
//     }
//   };

//   // Handle status persistence
//   const handleStatusChange = () => {
//     // Persist status to database
//     console.log('Status:', status); // Replace this with your database API call
//   };

//   if (!destination.lat || !destination.lng) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Typography variant="h4" component="h1">
//           No Current Delivery
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Route Tracking
//       </Typography>

//       <Typography variant="h6" gutterBottom>
//         Job ID: {jobId}
//       </Typography>

//       {/* Status Input */}
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//         <TextField
//           label="Delivery Status"
//           variant="outlined"
//           value={status}
//           InputProps={{
//             readOnly: true,
//           }}
//           fullWidth
//         />
//         <Button variant="contained" color="primary" onClick={handleStatusChange} sx={{ ml: 2 }}>
//           Persist Status
//         </Button>
//       </Box>

//       {/* Leaflet Map */}
//       <MapContainer style={containerStyle} center={currentPosition} zoom={14}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         {currentPosition && (
//           <Marker
//             position={currentPosition}
//             icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png' })}
//           />
//         )}
//         {destination && (
//           <Marker
//             position={destination}
//             icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png' })}
//           />
//         )}
//         {route && <Polyline positions={route} color="blue" />}
//       </MapContainer>

//       {/* Get Directions Button */}
//       <Button variant="contained" color="primary" onClick={handleGetDirections} sx={{ mt: 4 }}>
//         Get Directions
//       </Button>
//     </Box>
//   );
// };

// export default function Page(): React.JSX.Element {
//   return <RouteTracking />;
// }