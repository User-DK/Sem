import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const driverNavItems = [
  {key: 'jobs' , title: 'Jobs', href: paths.driver.jobs, icon: 'jobs'},
  {key: 'routeTracking' , title: 'Route Tracking', href: paths.driver.routeTracking, icon: 'routeTracking'},
  { key: 'account', title: 'Account', href: paths.driver.account, icon: 'user' },
] satisfies NavItemConfig[];
