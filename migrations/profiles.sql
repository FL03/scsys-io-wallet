CREATE SCHEMA IF NOT EXISTS public;
-- Create a schema to store additional information about users
CREATE SCHEMA IF NOT EXISTS accounts;
-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  customer_id     uuid,
  username        TEXT NOT NULL UNIQUE,
  avatar_url      TEXT,
  bio             TEXT DEFAULT ''::TEXT,
  display_name    TEXT DEFAULT ''::TEXT,
  name_prefix     TEXT NULL,
  name_suffix     TEXT NULL,
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
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view a user's profile" public.profiles
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own data"  public.profiles
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS uid) = id) 
  WITH check (( SELECT auth.uid() AS uid) = id);

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
-- This trigger automatically creates a profile when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT 
  ON auth.users
  FOR each ROW EXECUTE PROCEDURE public.handle_new_user();
-- This trigger automatically updated the updated_at column when the row is updated
CREATE OR REPLACE FUNCTION public.handle_profile_update() 
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
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

-- Create a bucket for user avatars
-- INSERT INTO storage.buckets 
--   (id, name, public)
-- VALUE 
--   ('avatars', 'avatars', true);