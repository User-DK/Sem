import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const userNavItems = [
  {key: 'bookings' , title: 'Bookings', href: paths.user.bookings, icon: 'bookings'},
  {key: 'tracking' , title: 'Tracking', href: paths.user.tracking, icon: 'tracking'},
  {key: 'price-estimate' , title: 'Price Estimate', href: paths.user.priceestimate, icon: 'priceEstimate'},
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
