-- Create a new table for user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid primary key not null unique default gen_random_uuid(),
  uid         uuid not null references public.profiles on delete cascade,
  message     text default '',
  status      text not null default 'unread',
  type        text not null default 'info'
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users may manage their notifications" ON public.notifications
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS uid) = uid) 
  WITH check (( SELECT auth.uid() AS uid) = uid);