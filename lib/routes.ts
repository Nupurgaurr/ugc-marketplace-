/**
 * Single place every route in the app is addressed from. Nothing links to
 * /admin/login except a person typing it directly — do not add it here in a
 * way any nav/footer component would consume.
 */
export const ROUTES = {
  home: '/',

  client: {
    register: '/client/register',
    login: '/client/login',
    dashboard: '/client/dashboard',
    discover: '/client/discover',
    shortlist: '/client/shortlist',
    requests: '/client/requests',
    brief: '/client/brief',
  },

  creator: {
    register: '/creator/register',
    login: '/creator/login',
    dashboard: '/creator/dashboard',
    profile: '/creator/profile',
    requests: '/creator/requests',
  },

  admin: {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    creators: '/admin/creators',
    clients: '/admin/clients',
    requests: '/admin/requests',
    reports: '/admin/reports',
  },
} as const;
