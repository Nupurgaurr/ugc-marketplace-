-- ============================================================================
-- Follower count, collected once against the primary profile.
--
-- It lives on the profile rather than on `creators` because reach belongs to
-- an account, not to a person: a creator with three platforms has three
-- different numbers, and BCM will eventually want all of them.
-- ============================================================================

alter table creator_social_profiles
  add column follower_count integer
  check (follower_count is null or (follower_count >= 0 and follower_count <= 1000000000));
