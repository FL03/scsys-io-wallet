-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY DEFAULT auth.uid(),
  username        TEXT NOT NULL UNIQUE,
  customer_id     uuid UNIQUE,
  avatar_url      TEXT,
  bio             TEXT DEFAULT ''::TEXT,
  full_name       TEXT DEFAULT ''::TEXT,
  name_prefix     TEXT,
  name_suffix     TEXT,
  first_name      TEXT,
  middle_name     TEXT,
  last_name       TEXT,
  role            TEXT default 'user',
  status          TEXT default 'active',
  email           TEXT array,
  phone           TEXT array,
  socials         TEXT array,
  department      TEXT,
  titles          TEXT array,
  metadata        jsonb,
  website         TEXT,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz default now(),

  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20)
);

-- Create a new table for user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  username    TEXT NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  message     TEXT NOT NULL DEFAULT ''::TEXT,
  status      TEXT NOT NULL DEFAULT 'unread',
  type        TEXT NOT NULL DEFAULT 'info'
);

-- Profile table functions and triggers
-- ----------------------------------
-- This function is triggered whenever a new user is created.
-- The function 
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SET search_path = ''
LANGUAGE plpgsql 
SECURITY definer
AS $$
BEGIN
  -- Check if the username is provided
  IF new.raw_user_meta_data->>'username' IS NULL OR new.raw_user_meta_data->>'username' = '' THEN
    RAISE EXCEPTION 'Username must be provided for new users';
  END IF;

  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  
  RETURN new;
END;
$$;

-- This function retrives the username for the current user
CREATE OR REPLACE FUNCTION public.username()
RETURNS TEXT
LANGUAGE plpgsql 
SECURITY definer
AS $$
DECLARE
  current_username TEXT;
BEGIN
  -- Retrieve the username for the current user
  SELECT username INTO current_username
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN current_username;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- A trigger automatically invoked whenever a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT 
  ON auth.users
  FOR each ROW EXECUTE PROCEDURE public.handle_new_user();
-- trigger for updating the timestamp for a profile
CREATE OR REPLACE TRIGGER trg_notification_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
-- trigger for updating the timestamp for a profile
CREATE OR REPLACE TRIGGER trg_profile_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users may manage their notifications" ON public.notifications
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS uid) = uid) 
  WITH check (( SELECT auth.uid() AS uid) = uid);

CREATE POLICY "Anyone can view a user's profile" public.profiles
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own data"  public.profiles
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS uid) = id) 
  WITH check (( SELECT auth.uid() AS uid) = id);