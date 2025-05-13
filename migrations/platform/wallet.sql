-- Create a schema to store additional information about users
CREATE SCHEMA IF NOT EXISTS wallet;
-- grant the schema certain permissions
GRANT USAGE ON SCHEMA wallet TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA wallet TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA wallet TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA wallet TO anon, authenticated, service_role;
-- alter the default privileges for the schema
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA wallet GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA wallet GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA wallet GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;


CREATE TABLE IF NOT EXISTS wallet.credentials (

  id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid() PRIMARY KEY,
  username  text NOT NULL UNIQUE DEFAULT public.username() ON DELETE CASCADE REFERENCES public.profiles (username)
);