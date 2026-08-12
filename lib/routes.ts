/**
 * Single place every route in the app is addressed from. Nothing links to
 * /admin/login except a person typing it directly — do not add it here in a
 * way any nav/footer component would consume.
 */
export const ROUTES = {
  home: '/',
  discover: '/discover',
  creatorProfile: (slug: string) => `/discover/${slug}`,
  becomeCreator: '/become-a-creator',
  becomeCreatorApply: '/become-a-creator/apply',

  client: {
    register: '/client/register',
    login: '/client/login',
    dashboard: '/client/dashboard',
    shortlist: '/client/shortlist',
    requests: '/client/requests',
    briefs: '/client/briefs',
    briefNew: '/client/briefs/new',
    briefPitches: (id: string) => `/client/briefs/${id}/pitches`,
  },

  creator: {
    register: '/become-a-creator/apply',
    login: '/creator/login',
    dashboard: '/creator/dashboard',
    profile: '/creator/profile',
    requests: '/creator/requests',
    briefs: '/creator/briefs',
    pitches: '/creator/pitches',
  },

  admin: {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    creators: '/admin/creators',
    clients: '/admin/clients',
    requests: '/admin/requests',
    briefs: '/admin/briefs',
    reports: '/admin/reports',
  },
} as const;
