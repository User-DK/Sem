import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const adminNavItems = [
  { key: 'overview', title: 'Overview', href: paths.admin.overview, icon: 'chart-pie' },
  { key: 'fleetManagement', title: 'Fleet Management', href: paths.admin.fleetManagement, icon: 'fleetManagement' },
] satisfies NavItemConfig[];