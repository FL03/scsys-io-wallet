-- create the schema if it does not exist
CREATE SCHEMA IF NOT EXISTS blogger;
-- grant the schema certain permissions
GRANT USAGE ON SCHEMA blogger TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA blogger TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA blogger TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA blogger TO anon, authenticated, service_role;
-- alter the default privileges for the schema
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA blogger GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA blogger GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA blogger GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- *** Define various functions common to the schema ***
-- when called, this function updates the updated_at column of some row
CREATE OR REPLACE FUNCTION blogger.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- *** Tables ***
-- create a table for managing user posts
CREATE TABLE IF NOT EXISTS  blogger.posts (
    id            uuid NOT NULL PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    creator       TEXT NOT NULL DEFAULT public.username(),
    description   TEXT DEFAULT ''::text,
    title         TEXT NOT NULL DEFAULT ''::text,
    slug          TEXT NOT NULL DEFAULT ''::text,
    content       TEXT NOT NULL DEFAULT ''::text,
    tumbnail      TEXT DEFAULT ''::text,
    bookmarks     INTEGER NOT NULL DEFAULT 0,
    category      TEXT NOT NULL DEFAULT 'general'::text,
    likes         INTEGER NOT NULL DEFAULT 0,
    status        TEXT NOT NULL DEFAULT 'draft'::text,
    tags          TEXT[] NOT NULL DEFAULT '{}'::text[],
    is_featured   boolean NOT NULL DEFAULT false,
    is_private    boolean NOT NULL DEFAULT false,
    is_published  boolean NOT NULL DEFAULT false,
    created_at    timestamp with time zone NOT NULL DEFAULT now(),
    published_at  timestamp with time zone DEFAULT NULL,
    updated_at    timestamp with time zone NOT NULL DEFAULT now(),

    CONSTRAINT posts_creator_fkey FOREIGN KEY (creator) REFERENCES public.profiles (username) ON DELETE CASCADE
) TABLESPACE pg_default;

-- *** Row Level Security (RLS) ***
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.

-- Enable RLS for the posts table
ALTER TABLE blogger.posts ENABLE ROW LEVEL SECURITY;

-- enable authenticated users to manage their own posts
CREATE POLICY "Authenticated users can manage their posts" 
  ON blogger.posts
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT public.username() AS username) = creator) 
  WITH CHECK (( SELECT public.username() AS username) = creator);
-- allow authenticated users to view any published, public posts
CREATE POLICY "Authenticated users can view public posts" 
  ON blogger.posts
  AS permissive
  FOR SELECT
  TO authenticated 
  USING (is_published = true AND is_private = false)
  WITH CHECK (is_published = true AND is_private = false);

-- *** Functions and Triggers for the posts table ***

-- this function is used to generate a slug from the title of the post
CREATE OR REPLACE FUNCTION blogger.generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    -- check if the slug is empty or null
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        -- generate a slug from the title using the public.slugify function
        NEW.slug = public.slugify(NEW.title);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- update the timestamp of the post whenever it is modified
CREATE OR REPLACE TRIGGER trg_blogger_post_updated_at
BEFORE UPDATE ON blogger.posts
FOR EACH ROW
EXECUTE FUNCTION blogger.update_timestamp();

-- trigger a function to generate a slug from the title of the post
CREATE OR REPLACE TRIGGER trg_blogger_post_generate_slug
BEFORE INSERT OR UPDATE ON blogger.posts
FOR EACH ROW
EXECUTE FUNCTION blogger.generate_slug();

-- This function returns a text value that resolves to the entries corresponding url.
CREATE OR REPLACE FUNCTION blogger.generate_content_url(creator text, id uuid, extension text)
RETURNS text AS $$
BEGIN
    RETURN format('https://gilqgzjkzkmhbbcqidqb.supabase.co/storage/v1/object/public/blogger/%s/%s.%s', creator, id, extension);
END;
$$ LANGUAGE plpgsql;
-- this function returns a trigger for pre-computing the content url
CREATE OR REPLACE FUNCTION blogger.populate_content_url()
RETURNS TRIGGER AS $$
BEGIN
    NEW.content_url := blogger.generate_content_url(NEW.creator, NEW.id, 'mdx');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create a trigger that pre-populates the content url using the creators username and entries id.
CREATE TRIGGER trg_generate_content_url
AFTER INSERT OR UPDATE 
ON blogger.posts
FOR EACH ROW
EXECUTE FUNCTION blogger.populate_content_url();