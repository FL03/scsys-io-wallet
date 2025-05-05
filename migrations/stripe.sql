-- Timestamp: 2025-01-09
-- Version: 0.0.1

-- Create the table for public.pricing
create table if not exists public.pricing (
    id              uuid not null primary key unique default gen_random_uuid(),
    title           text not null,
    description     text,
    price           numeric(10, 2),
    currency        text not null default 'usd',
    interval        text default 'monthly',
    trial_period    int default 0,
    metadata        jsonb
); 
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view the product pricing table." on public.pricing
  FOR SELECT
  USING (true);

-- Create the Stripe schema and foreign tables
create extension if not exists wrappers with schema extensions;

create schema if not exists stripe;

create foreign data wrapper stripe_wrapper
  handler stripe_fdw_handler
  validator stripe_fdw_validator;

CREATE OR REPLACE SERVER stripe_server
  foreign data wrapper stripe_wrapper
  options (
    api_key_id '8b6ff443-ae30-446d-8400-a8c3f73c2c8a' -- The Key ID from above, required if api_key_name is not specified.
  );

-- Create foreign tables for the Stripe API
create foreign table if not exists stripe.accounts (
  id text,
  business_type text,
  country text,
  email text,
  type text,
  created timestamp,
  attrs jsonb
)

server stripe_server
options (
  object 'accounts'
);

create foreign table if not exists stripe.products (
  id text,
  name text,
  active bool,
  default_price text,
  description text,
  created timestamp,
  updated timestamp,
  attrs jsonb
)

server stripe_server
options (
  object 'products',
  rowid_column 'id'
);

create foreign table if not exists stripe.customers (
  id text,
  email text,
  name text,
  description text,
  created timestamp,
  attrs jsonb
)

server stripe_server
options (
  object 'customers',
  rowid_column 'id'
);
