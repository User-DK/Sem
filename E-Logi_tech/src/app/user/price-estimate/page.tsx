'use client';

import React, { useState } from 'react';
import { Box, Button, Card, Divider, Grid, Modal, TextField, Typography } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { calculatePrice } from '../../../utils/calculate-price'; // Import the function from its new location

export default function Page(): React.JSX.Element {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [pickupDate, setPickupDate] = useState<Dayjs>(dayjs());
  const [pickupTime, setPickupTime] = useState<Dayjs>(dayjs());
  const [open, setOpen] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const handleCalculate = async (event: React.FormEvent) => {
    event.preventDefault();
    const price = await calculatePrice(pickupAddress, dropAddress, pickupTime, pickupDate);
    if (typeof price === 'number') {
      setEstimatedPrice(null);
    } else {
      setEstimatedPrice(price.price);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <form onSubmit={handleCalculate}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Price Estimation
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pickup Address"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Drop Address"
                value={dropAddress}
                onChange={(e) => setDropAddress(e.target.value)}
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <DatePicker
                label="Pickup Date"
                value={pickupDate}
                onChange={(newValue) => setPickupDate(newValue!)}
                slotProps={{ textField: { required: true } }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TimePicker
                label="Pickup Time"
                value={pickupTime}
                onChange={(newValue) => setPickupTime(newValue!)}
                slotProps={{ textField: { required: true } }}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" type="submit">
            Estimate Price
          </Button>
        </Card>
      </form>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, maxWidth: 400, mx: 'auto', mt: 4 }}
        >
          <Typography variant="h6" component="h2">
            Estimated Price
          </Typography>
          <Divider sx={{ my: 2 }} />
          {estimatedPrice !== null ? (
            <Typography variant="body1">
              The estimated price for the trip is <strong>₹{estimatedPrice.toFixed(2)}</strong>.
            </Typography>
          ) : (
            <Typography variant="body1">Unable to calculate the price.</Typography>
          )}
          <Button onClick={handleClose} size="small" variant="outlined" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
