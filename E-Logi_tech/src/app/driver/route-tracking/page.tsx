// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { Box, Button, TextField, Typography } from '@mui/material';
// import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

// import 'leaflet/dist/leaflet.css';

// import L from 'leaflet';

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

//   useEffect(() => {
//     async function updateJobLocation(jobId) {
//       if (!navigator.geolocation) {
//         alert('Geolocation is not supported by this browser.');
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;

//           try {
//             const response = await fetch(`/api/job/${jobId}`, {
//               method: 'PATCH', // Use PATCH or PUT for updates
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 currentLocation: {
//                   coordinates: {
//                     latitude,
//                     longitude,
//                   },
//                 },
//               }),
//             });

//             if (!response.ok) {
//               const error = await response.json();
//               throw new Error(error.message);
//             }

//             const data = await response.json();
//             console.log('Location updated successfully:', data);
//           } catch (error) {
//             console.error('Error updating location:', error);
//           }
//         },
//         (err) => {
//           console.error('Geolocation error:', err.message);
//         }
//       );
//     }
//   }, []);

//   useEffect(() => {
//     if (status === 'enroute to pickup') {
//       setDestination({ lat: Number(plat), lng: Number(plng) });
//     } else if (status === 'enroute to drop') {
//       setDestination({ lat: Number(dlat), lng: Number(dlng) });
//     }
//   }, [status, plat, plng, dlat, dlng]);

//   const handleGetDirections = async () => {
//     if (currentPosition && destination) {
//       try {
//         const response = await fetch('http://localhost:5000/api/route', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             currentPosition,
//             destination,
//           }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setRoute(data.route.map(([lng, lat]: [number, number]) => [lat, lng]));
//         } else {
//           console.error('Error fetching route:', data.error);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     }
//   };

//   // Handle status persistence
//   const handleStatusChange = () => {
//     // Persist status to database
//     console.log('Status:', status);
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

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Button, TextField, Typography } from '@mui/material';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const RouteTracking = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams?.get('jobId');
  const plat = searchParams?.get('plat');
  const plng = searchParams?.get('plng');
  const dlat = searchParams?.get('dlat');
  const dlng = searchParams?.get('dlng');
  const initialStatus = searchParams?.get('status');

  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [destination, setDestination] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [route, setRoute] = useState<any>(null); // Store the calculated route
  const [status, setStatus] = useState(initialStatus || 'enroute to pickup');

  // Function to update job location
  const updateJobLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(`/api/get-geolocation/${jobId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentLocation: {
                coordinates: {
                  latitude,
                  longitude,
                },
              },
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
          }

          const data = await response.json();
          console.log('Location updated successfully:', data);
          setCurrentPosition({ lat: latitude, lng: longitude });
        } catch (error) {
          console.error('Error updating location:', error);
        }
      },
      (err) => {
        console.error('Geolocation error:', err.message);
      }
    );
  };

  useEffect(() => {
    updateJobLocation();

    const interval = setInterval(updateJobLocation, 600000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'enroute to pickup') {
      setDestination({ lat: Number(plat), lng: Number(plng) });
    } else if (status === 'enroute to drop') {
      setDestination({ lat: Number(dlat), lng: Number(dlng) });
    }
  }, [status, plat, plng, dlat, dlng]);

  const handleGetDirections = async () => {
    if (currentPosition && destination) {
      try {
        const response = await fetch('http://localhost:5000/api/route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPosition,
            destination,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setRoute(data.route.map(([lng, lat]: [number, number]) => [lat, lng]));
        } else {
          console.error('Error fetching route:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Handle status persistence
  const handleStatusChange = () => {
    // Persist status to database
    console.log('Status:', status);
  };

  if (!destination.lat || !destination.lng) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" component="h1">
          No Current Delivery
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Route Tracking
      </Typography>

      <Typography variant="h6" gutterBottom>
        Job ID: {jobId}
      </Typography>

      {/* Status Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Delivery Status"
          variant="outlined"
          value={status}
          InputProps={{
            readOnly: true,
          }}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleStatusChange} sx={{ ml: 2 }}>
          Persist Status
        </Button>
      </Box>

      {/* Leaflet Map */}
      <MapContainer style={containerStyle} center={currentPosition} zoom={14}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png' })}
          />
        )}
        {destination && (
          <Marker
            position={destination}
            icon={L.icon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png' })}
          />
        )}
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>

      {/* Get Directions Button */}
      <Button variant="contained" color="primary" onClick={handleGetDirections} sx={{ mt: 4 }}>
        Get Directions
      </Button>
    </Box>
  );
};

export default function Page(): React.JSX.Element {
  return <RouteTracking />;
}
