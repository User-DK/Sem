import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import { ClipboardText, GasCan as Fuel, Truck } from '@phosphor-icons/react/dist/ssr';
import { BaseballCap } from '@phosphor-icons/react/dist/ssr/BaseballCap';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import dayjs from 'dayjs';

import { config } from '@/config';
import { DataCard } from '@/components/dashboard/overview/data-card';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={4} sm={6} xs={12}>
        <DataCard
          Heading="Total Customers"
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value="1.6k"
          icon={UsersIcon}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <DataCard
          Heading="Total Bookings"
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value="1.6k"
          icon={ClipboardText}
        />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <DataCard
          Heading="Total Drivers"
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value="24"
          icon={BaseballCap}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <DataCard
          Heading="Total Vehicles"
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value="24"
          icon={Truck}
        />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <DataCard
          Heading="Active Vehicles"
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value="24"
          icon={Truck}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <DataCard
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value="$15k"
          Heading="Total Profit"
          icon={ReceiptIcon}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value={75.5}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <DataCard
          Heading="Fuel Expenses"
          sx={{
            height: '100%',
            border: 'blue 1px solid',
            transition: 'transform 0.2s, background-color 0.2s',
            '&:hover': {
              backgroundColor: 'lightblue',
              transform: 'scale(1.05)',
            },
          }}
          value="24"
          icon={Fuel}
        />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
