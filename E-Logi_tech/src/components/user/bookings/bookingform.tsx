'use client';

import React, { useEffect, useRef, useState } from 'react';
import { calculatePrice } from '@/app/user/price-estimate/page';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

interface BookingConfirmationFormProps {
  open: boolean;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export function BookingConfirmationForm({ open, handleClose }: BookingConfirmationFormProps): React.JSX.Element {
  const [serviceName, setServiceName] = useState<string>('');
  const [services, setServices] = useState<string[]>([]);
  const [phone, setPhone] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<Dayjs>(dayjs());
  const [pickupTime, setPickupTime] = useState<Dayjs>(dayjs());
  const [pickupAddress, setPickupAddress] = useState({
    city: '',
    state: '',
    zip: '',
    street: '',
    coords: { lat: 0, lng: 0 },
  });
  const [dropAddress, setDropAddress] = useState({
    city: '',
    state: '',
    zip: '',
    street: '',
    coords: { lat: 0, lng: 0 },
  });

  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitForm, setSubmitForm] = useState(false);
  const handleOpenPriceModal = async () => {
    const formattedPickupAddress = `${pickupAddress.street}, ${pickupAddress.city}, ${pickupAddress.state}`;
    const formattedDropAddress = `${dropAddress.street}, ${dropAddress.city}, ${dropAddress.state}`;
    const priceEstimateData = await calculatePrice(
      formattedPickupAddress,
      formattedDropAddress,
      pickupTime,
      pickupDate
    );

    if (typeof priceEstimateData === 'object') {
      setPickupAddress({ ...pickupAddress, coords: priceEstimateData.pickup });
      setDropAddress({ ...dropAddress, coords: priceEstimateData.drop });
      setEstimatedPrice(priceEstimateData.price);
      setEstimatedDistance(priceEstimateData.distance);
    } else {
      console.error('Unexpected response from calculatePrice:', priceEstimateData);
    }
    setOpenPriceModal(true);
  };
  const handleClosePriceModal = () => {
    setOpenPriceModal(false);
  };

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  // API call to calculate lat/lng based on address
  const calculateCoords = async (address: string) => {
    try {
      const response = await fetch('/api/get-coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching coordinates: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Expected { lat, lng } format from API response
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return { lat: 0, lng: 0 }; // Default to 0,0 in case of error
    }
  };
  useEffect(() => {
    if (submitForm && formRef.current) {
      formRef.current.submit();
      setSubmitForm(false);
    }
  }, [submitForm]);
  // Handle submit and send data to the backend
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const bookingData = {
      serviceName,
      phone,
      pickupDate: pickupDate.format('YYYY-MM-DD'),
      pickupTime: pickupTime.format('HH:mm'),
      pickupAddress: {
        ...pickupAddress,
      },
      dropAddress: {
        ...dropAddress,
      },
      estimatedPrice: 0,
      approvals: false,
      status: 'pending',
    };

    console.log('Booking Data:', bookingData);

    // Corrected fetch call
    try {
      const response = await fetch('/api/write-booking', {
        method: 'POST', // Set the method to POST
        headers: {
          'Content-Type': 'application/json', // Ensure the correct headers are set
        },
        body: JSON.stringify(bookingData), // Serialize bookingData to JSON
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Booking successfully submitted:', result);
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 5,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
            maxWidth: 600,
            mx: 'auto',
            mt: 4,
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <form ref={formRef}  onSubmit={handleSubmit}>
            <Card sx={{ maxWidth: 600 }}>
              <CardHeader subheader="Please Fill up the information correctly" title="Booking Details" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Service Name</InputLabel>
                      <OutlinedInput
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value as string)}
                        label="Service Name"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Phone</InputLabel>
                      <OutlinedInput value={phone} onChange={(e) => setPhone(e.target.value)} label="Phone" />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <DatePicker
                        label="Pickup Date"
                        value={pickupDate}
                        onChange={(newValue) => setPickupDate(newValue!)}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <TimePicker
                        label="Pickup Time"
                        value={pickupTime}
                        onChange={(newValue) => setPickupTime(newValue!)}
                      />
                    </FormControl>
                  </Grid>

                  {/* Pickup Address Fields */}
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Pickup City"
                      value={pickupAddress.city}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, city: e.target.value })}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Pickup State"
                      value={pickupAddress.state}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, state: e.target.value })}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Pickup Zip"
                      value={pickupAddress.zip}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, zip: e.target.value })}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Pickup Street"
                      value={pickupAddress.street}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, street: e.target.value })}
                    />
                  </Grid>

                  {/* Drop Address Fields */}
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Drop City"
                      value={dropAddress.city}
                      onChange={(e) => setDropAddress({ ...dropAddress, city: e.target.value })}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Drop State"
                      value={dropAddress.state}
                      onChange={(e) => setDropAddress({ ...dropAddress, state: e.target.value })}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Drop Zip"
                      value={dropAddress.zip}
                      onChange={(e) => setDropAddress({ ...dropAddress, zip: e.target.value })}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Drop Street"
                      value={dropAddress.street}
                      onChange={(e) => setDropAddress({ ...dropAddress, street: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button onClick={handleOpenPriceModal} variant="contained" color="primary">
                  Get Price Estimate
                </Button>
                <Button onClick={() => handleClose({}, 'escapeKeyDown')}>Cancel</Button>
              </CardActions>
            </Card>
          </form>
        </Box>
      </Modal>
      {openPriceModal && (
        <Dialog open={openPriceModal} onClose={handleClosePriceModal}>
          <DialogTitle>Estimated Price</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 24,
                maxWidth: 400,
                mx: 'auto',
                mt: 4,
              }}
            >
              <Divider sx={{ my: 2 }} />
              {estimatedPrice !== null ? (
                <Typography variant="body1">
                  The estimated price for the trip is <strong>₹{estimatedPrice.toFixed(2)}</strong>.
                </Typography>
              ) : (
                <Typography variant="body1">Unable to calculate the price.</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Confirm Booking
            </Button>
            <Button onClick={handleClosePriceModal} size="small" variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
