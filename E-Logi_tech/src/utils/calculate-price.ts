

import { Dayjs } from 'dayjs';

export interface CalculatePriceResponse {
  pickup: any;
  drop: any;
  distance: number;
  price: number;
}

export const calculatePrice = async (
  pickupAddress: string,
  dropAddress: string,
  pickupTime: Dayjs,
  pickupDate: Dayjs
): Promise<CalculatePriceResponse | number> => {
  const pickupResponse = await fetch('/api/get-latlngfromaddress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: pickupAddress }),
  });
  const dropResponse = await fetch('/api/get-latlngfromaddress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: dropAddress }),
  });

  const pickupLatLng = await pickupResponse.json();
  const dropLatLng = await dropResponse.json();

  console.log('Pickup LatLng:', pickupLatLng);
  console.log('Drop LatLng:', dropLatLng);

  const distanceResponse = await fetch('/api/osrm-route-distance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin: pickupLatLng, destination: dropLatLng }),
  });

  const distance = await distanceResponse.json();
  console.log('Distance:', distance);

  if (distance && distance.distance) {
    const price = (Number(distance.distance) * 10) / 1000;
    return {
      pickup: pickupLatLng,
      drop: dropLatLng,
      distance: distance.distance,
      price,
    };
  }

  return -1;
};
