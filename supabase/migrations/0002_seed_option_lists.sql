-- ============================================================================
-- Option lists. Sensible defaults so nothing is hardcoded in the frontend.
-- BCM edits these from admin later; re-running this file is safe.
-- ============================================================================

insert into categories (slug, label, sort_order) values
  ('beauty_skincare',     'Beauty & Skincare',     10),
  ('food_beverage',       'Food & Beverage',       20),
  ('fashion_apparel',     'Fashion & Apparel',     30),
  ('tech_gadgets',        'Tech & Gadgets',        40),
  ('fitness_wellness',    'Fitness & Wellness',    50),
  ('home_kitchen',        'Home & Kitchen',        60),
  ('baby_parenting',      'Baby & Parenting',      70),
  ('travel_hospitality',  'Travel & Hospitality',  80),
  ('pet_care',            'Pet Care',              90),
  ('finance_apps',        'Finance & Apps',       100),
  ('jewellery',           'Jewellery',            110),
  ('automotive',          'Automotive',           120)
on conflict (slug) do update
  set label = excluded.label, sort_order = excluded.sort_order;

insert into content_styles (slug, label, sort_order) values
  ('grwm',             'GRWM',             10),
  ('unboxing',         'Unboxing',         20),
  ('demo',             'Demo',             30),
  ('testimonial',      'Testimonial',      40),
  ('recipe',           'Recipe',           50),
  ('day_in_the_life',  'Day in the life',  60),
  ('try_on_haul',      'Try-on haul',      70),
  ('problem_solution', 'Problem, solution', 80),
  ('explainer',        'Explainer',        90)
on conflict (slug) do update
  set label = excluded.label, sort_order = excluded.sort_order;
