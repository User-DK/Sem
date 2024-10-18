'use client';

import React, { useEffect, useRef, useState } from 'react';
import { calculatePrice, CalculatePriceResponse } from '@/app/user/price-estimate/page';
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
  Modal,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { set } from 'mongoose';

import { useUser } from '@/hooks/use-user';

interface BookingConfirmationFormProps {
  open: boolean;
  handleClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export function BookingConfirmationForm({ open, handleClose }: BookingConfirmationFormProps): React.JSX.Element {
  const [serviceName, setServiceName] = useState<string>('');
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
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isPriceConfirmed, setIsPriceConfirmed] = useState(false); // Track price confirmation
  const { user } = useUser();
  const [priceEstimateData, setPriceEstimateData] = useState<CalculatePriceResponse | number>(-1);

  const handleOpenPriceModal = async () => {
    const formattedPickupAddress = `${pickupAddress.street}, ${pickupAddress.city}, ${pickupAddress.state}`;
    const formattedDropAddress = `${dropAddress.street}, ${dropAddress.city}, ${dropAddress.state}`;

    if (estimatedPrice === null) {
      const priceEstimateData = await calculatePrice(
        formattedPickupAddress,
        formattedDropAddress,
        pickupTime,
        pickupDate
      );
      setPriceEstimateData(priceEstimateData);
    }

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

  // Handle form submission after confirming the price
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isPriceConfirmed) {
      console.error('Price not confirmed');
      return;
    }
    if (!user) {
      console.error('User is not logged in');
      return;
    }
    // Retrieve the user data from local storage
    const userLocal = localStorage.getItem('user');

    // Define userId variable
    let userId = '';

    // Check if user data exists in local storage
    if (userLocal) {
      // Parse the JSON string back into an object
      const parsedUser = JSON.parse(userLocal);

      // Access the user ID
      userId = parsedUser.id;
      console.log('User ID:', userId);
    } else {
      console.log('No user data found in local storage');
    }

    const bookingData = {
      userId: userId,
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
      estimatedPrice,
      status: 'pending',
      approvals: 'not approved',
    };

    console.log('Submitting booking:', bookingData);

    try {
      const response = await fetch('/api/write-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Booking successfully submitted:', result);
      alert('Booking successfully submitted:');
      handleClose({}, 'escapeKeyDown');
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  // Handle price confirmation and trigger form submission
  const handlePriceConfirmation = () => {
    setIsPriceConfirmed(true);
    setOpenPriceModal(false);
    if (formRef.current) {
      formRef.current.requestSubmit(); // Trigger form submission
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
          <form ref={formRef} onSubmit={handleSubmit}>
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
              <CardActions>
                <Button onClick={handleOpenPriceModal} variant="contained" color="primary">
                  Estimate Price
                </Button>
              </CardActions>
            </Card>
          </form>
        </Box>
      </Modal>

      {/* Price Modal */}
      <Dialog open={openPriceModal} onClose={handleClosePriceModal}>
        <DialogTitle>Price Estimate</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Estimated Distance: {estimatedDistance !== null ? Math.round(estimatedDistance / 1000) : 'N/A'} km
          </Typography>
          <Typography variant="body1">Estimated Price: ₹{estimatedPrice}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePriceModal} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handlePriceConfirmation} color="primary" variant="contained">
            Confirm and Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
