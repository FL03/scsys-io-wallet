-- Create a schema to store additional information about users
CREATE SCHEMA IF NOT EXISTS accounts;
-- grant the schema certain permissions
GRANT USAGE ON SCHEMA accounts TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA accounts TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA accounts TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA accounts TO anon, authenticated, service_role;
-- alter the default privileges for the schema
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA accounts GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA accounts GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA accounts GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;


-- Create a bucket for user avatars
-- INSERT INTO storage.buckets 
--   (id, name, public)
-- VALUE 
--   ('avatars', 'avatars', true);