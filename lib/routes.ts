/**
 * Single place every route in the app is addressed from. Nothing links to
 * /admin/login except a person typing it directly.
 */
export const ROUTES = {
  home: '/',
  becomeCreator: '/become-a-creator',
  becomeCreatorApply: '/become-a-creator/apply',

  creator: {
    apply: '/become-a-creator/apply',
    login: '/creator/login',
    dashboard: '/creator/dashboard',
    profile: '/creator/profile',
    payouts: '/creator/payouts',
  },

  admin: {
    login: '/admin/login',
    creators: '/admin/creators',
  },
} as const;
