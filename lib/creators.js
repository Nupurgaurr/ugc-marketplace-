/**
 * PROTOTYPE DATA ONLY.
 *
 * Every object here is shaped the way the `creators` table / `GET /api/creators`
 * response is expected to look once the Node + PostgreSQL backend described in
 * the report exists. Swapping `lib/api.js` for a real fetch should require no
 * component changes.
 *
 * @typedef {Object} CreatorPreview
 * @property {string} posterUrl      Auto-generated thumbnail (Mux / MediaConvert emits this at upload).
 * @property {string} previewUrl     Short muted loop used in the grid (MP4 now, HLS later).
 * @property {number} durationSec
 *
 * @typedef {Object} Creator
 * @property {string}  id            UUID in Postgres.
 * @property {string}  slug
 * @property {string}  name
 * @property {string}  category      FK -> categories
 * @property {string[]} contentStyles
 * @property {string[]} languages
 * @property {string}  city
 * @property {string}  state
 * @property {number}  rateMin       INR, per finished video.
 * @property {number}  rateMax
 * @property {number}  portfolioCount
 * @property {string}  turnaround
 * @property {'approved'} status     Only 'approved' rows are ever exposed to the client side.
 * @property {string}  approvedAt    Set by the admin approval queue.
 * @property {CreatorPreview} preview
 */

const media = (slug) => ({
  posterUrl: `/media/creators/${slug}.jpg`,
  previewUrl: `/media/creators/${slug}.mp4`,
  durationSec: 6,
});

/** @type {Creator[]} */
export const creators = [
  {
    id: 'c_01',
    slug: 'aisha-rahman',
    name: 'Aisha Rahman',
    category: 'Beauty & Skincare',
    contentStyles: ['GRWM', 'Unboxing'],
    languages: ['Hindi', 'English'],
    city: 'Mumbai',
    state: 'MH',
    rateMin: 8000,
    rateMax: 15000,
    portfolioCount: 14,
    turnaround: '5 days',
    status: 'approved',
    approvedAt: '2026-05-18',
    preview: media('aisha-rahman'),
  },
  {
    id: 'c_02',
    slug: 'rohan-kulkarni',
    name: 'Rohan Kulkarni',
    category: 'Tech & Gadgets',
    contentStyles: ['Unboxing', 'Demo'],
    languages: ['Marathi', 'Hindi', 'English'],
    city: 'Pune',
    state: 'MH',
    rateMin: 12000,
    rateMax: 20000,
    portfolioCount: 21,
    turnaround: '4 days',
    status: 'approved',
    approvedAt: '2026-04-02',
    preview: media('rohan-kulkarni'),
  },
  {
    id: 'c_03',
    slug: 'meera-suresh',
    name: 'Meera Suresh',
    category: 'Food & Beverage',
    contentStyles: ['Recipe', 'Testimonial'],
    languages: ['Tamil', 'English'],
    city: 'Chennai',
    state: 'TN',
    rateMin: 6000,
    rateMax: 12000,
    portfolioCount: 18,
    turnaround: '6 days',
    status: 'approved',
    approvedAt: '2026-06-11',
    preview: media('meera-suresh'),
  },
  {
    id: 'c_04',
    slug: 'devanshi-patel',
    name: 'Devanshi Patel',
    category: 'Fitness & Wellness',
    contentStyles: ['Testimonial', 'Day-in-the-life'],
    languages: ['Gujarati', 'Hindi'],
    city: 'Ahmedabad',
    state: 'GJ',
    rateMin: 7000,
    rateMax: 14000,
    portfolioCount: 11,
    turnaround: '5 days',
    status: 'approved',
    approvedAt: '2026-06-27',
    preview: media('devanshi-patel'),
  },
  {
    id: 'c_05',
    slug: 'priya-nambiar',
    name: 'Priya Nambiar',
    category: 'Fashion & Apparel',
    contentStyles: ['Try-on haul', 'GRWM'],
    languages: ['Malayalam', 'English'],
    city: 'Bengaluru',
    state: 'KA',
    rateMin: 10000,
    rateMax: 18000,
    portfolioCount: 26,
    turnaround: '7 days',
    status: 'approved',
    approvedAt: '2026-03-14',
    preview: media('priya-nambiar'),
  },
  {
    id: 'c_06',
    slug: 'arjun-sethi',
    name: 'Arjun Sethi',
    category: 'Home & Kitchen',
    contentStyles: ['Problem–solution', 'Demo'],
    languages: ['Hindi', 'Punjabi'],
    city: 'Delhi NCR',
    state: 'DL',
    rateMin: 5000,
    rateMax: 11000,
    portfolioCount: 9,
    turnaround: '4 days',
    status: 'approved',
    approvedAt: '2026-07-01',
    preview: media('arjun-sethi'),
  },
  {
    id: 'c_07',
    slug: 'ananya-bose',
    name: 'Ananya Bose',
    category: 'Baby & Parenting',
    contentStyles: ['Day-in-the-life', 'Testimonial'],
    languages: ['Bengali', 'Hindi'],
    city: 'Kolkata',
    state: 'WB',
    rateMin: 6000,
    rateMax: 13000,
    portfolioCount: 16,
    turnaround: '6 days',
    status: 'approved',
    approvedAt: '2026-05-29',
    preview: media('ananya-bose'),
  },
  {
    id: 'c_08',
    slug: 'kabir-rao',
    name: 'Kabir Rao',
    category: 'Automotive',
    contentStyles: ['Demo', 'Problem–solution'],
    languages: ['Telugu', 'English'],
    city: 'Hyderabad',
    state: 'TS',
    rateMin: 15000,
    rateMax: 25000,
    portfolioCount: 12,
    turnaround: '8 days',
    status: 'approved',
    approvedAt: '2026-02-20',
    preview: media('kabir-rao'),
  },
  {
    id: 'c_09',
    slug: 'sneha-iyer',
    name: 'Sneha Iyer',
    category: 'Jewellery',
    contentStyles: ['Try-on haul', 'Unboxing'],
    languages: ['Tamil', 'English'],
    city: 'Coimbatore',
    state: 'TN',
    rateMin: 9000,
    rateMax: 16000,
    portfolioCount: 19,
    turnaround: '5 days',
    status: 'approved',
    approvedAt: '2026-06-05',
    preview: media('sneha-iyer'),
  },
  {
    id: 'c_10',
    slug: 'vikram-chauhan',
    name: 'Vikram Chauhan',
    category: 'Finance & Apps',
    contentStyles: ['Explainer', 'Demo'],
    languages: ['Hindi', 'English'],
    city: 'Jaipur',
    state: 'RJ',
    rateMin: 8000,
    rateMax: 15000,
    portfolioCount: 13,
    turnaround: '5 days',
    status: 'approved',
    approvedAt: '2026-07-19',
    preview: media('vikram-chauhan'),
  },
  {
    id: 'c_11',
    slug: 'nikita-fernandes',
    name: 'Nikita Fernandes',
    category: 'Travel & Hospitality',
    contentStyles: ['Day-in-the-life', 'Explainer'],
    languages: ['Konkani', 'English', 'Hindi'],
    city: 'Panaji',
    state: 'GA',
    rateMin: 11000,
    rateMax: 20000,
    portfolioCount: 22,
    turnaround: '7 days',
    status: 'approved',
    approvedAt: '2026-04-23',
    preview: media('nikita-fernandes'),
  },
  {
    id: 'c_12',
    slug: 'harleen-gill',
    name: 'Harleen Gill',
    category: 'Pet Care',
    contentStyles: ['Unboxing', 'Recipe'],
    languages: ['Punjabi', 'Hindi'],
    city: 'Chandigarh',
    state: 'CH',
    rateMin: 5000,
    rateMax: 10000,
    portfolioCount: 8,
    turnaround: '4 days',
    status: 'approved',
    approvedAt: '2026-07-08',
    preview: media('harleen-gill'),
  },
];

/** Languages surfaced in the regional section — drawn from the creator set, not invented. */
export const languagesInNetwork = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Marathi',
  'Bengali',
  'Gujarati',
  'Malayalam',
  'Punjabi',
  'Konkani',
];

/**
 * An approved profile, used to show creators what their own page looks like
 * once it goes live. Portfolio clips reuse the demo media set — in production
 * these are the creator's own uploads coming back from the video service.
 * PROTOTYPE DATA.
 */
export const featuredProfile = {
  ...creators[0],
  bio: 'Short-form beauty and skincare content out of Mumbai. Mostly unboxings, routines and honest first-impression pieces, shot at home in Hindi and English.',
  availability: 'Available — taking briefs from mid-August',
  handles: ['@aisha.rahman', 'youtube.com/@aisharahman'],
  pastWork: [
    'Skincare launch — 6 videos, Hindi + English',
    'Haircare refill range — testimonial set',
    'Sunscreen SPF explainer — 3 videos',
  ],
  portfolio: [
    { id: 'p1', style: 'Unboxing', slug: 'aisha-rahman' },
    { id: 'p2', style: 'GRWM', slug: 'devanshi-patel' },
    { id: 'p3', style: 'Testimonial', slug: 'sneha-iyer' },
    { id: 'p4', style: 'Routine', slug: 'priya-nambiar' },
    { id: 'p5', style: 'First impression', slug: 'ananya-bose' },
    { id: 'p6', style: 'Demo', slug: 'meera-suresh' },
  ].map((item) => ({ ...item, ...media(item.slug) })),
};

/**
 * Sample incoming requests for the creator-side inbox preview. PROTOTYPE DATA —
 * the real records come from the `requests` table and move through
 * requested → accepted → delivered → approved.
 */
export const sampleRequests = [
  {
    id: 'r1',
    brand: 'D2C skincare brand',
    campaign: 'SPF range launch',
    need: '3 videos · Unboxing + routine · Hindi',
    status: 'New',
  },
  {
    id: 'r2',
    brand: 'Haircare brand',
    campaign: 'Refill pack awareness',
    need: '2 videos · Testimonial · Hindi + English',
    status: 'Accepted',
  },
  {
    id: 'r3',
    brand: 'Wellness brand',
    campaign: 'Daily routine series',
    need: '4 videos · Day-in-the-life · English',
    status: 'Delivered',
  },
];
