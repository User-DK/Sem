export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  user: {
      bookings: '/user/bookings',
      tracking: '/user/tracking',
      priceestimate: '/user/price-estimate',
  },
  admin: {
      overview: '/admin',
      fleetManagement: '/admin/fleet-management',
  },
  driver: {
      jobs: '/driver/jobs',
      routeTracking: '/driver/route-tracking',
  },
  errors: {
    notFound: '/errors/not-found',
  },
} as const;