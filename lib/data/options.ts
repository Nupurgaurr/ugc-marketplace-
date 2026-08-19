import { createClient } from '@/lib/supabase/server';
import type { Category, ContentStyle } from '@/lib/types';

/** Option lists live in the database so BCM can edit them. Nothing in a
 *  component hardcodes these. */

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data;
}

export async function getContentStyles(): Promise<ContentStyle[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('content_styles')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data;
}
