import { BaseballCap, ClipboardText, Gps, Money, Package } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { NavigationArrow, Truck } from '@phosphor-icons/react/dist/ssr';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  //user specific icons
  bookings: ClipboardText,
  tracking: Gps,
  //admin specific icons
  fleetManagement: Truck,
  driverAssignment: BaseballCap,
  jobs: Package,
  //driver specific icons
  routeTracking: NavigationArrow,
  priceEstimate: Money,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
