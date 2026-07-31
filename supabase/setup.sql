-- Create the profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  user_id uuid references auth.users not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  display_name text,
  email text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create the portfolio_items table
create table portfolio_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null check (category in ('video', 'photo', 'banner', 'thumbnail')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  media_url text not null,
  thumbnail_url text,
  alt_text text not null,
  order integer not null default 0,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create the categories table
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create the settings table
create table settings (
  id uuid default gen_random_uuid() primary key,
  site_name text not null,
  tagline text,
  description text,
  logo_url text,
  favicon_url text,
  contact_email text not null,
  contact_phone text,
  social_links jsonb,
  analytics_id text,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Realtime for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table portfolio_items;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table settings;

-- Create storage bucket for portfolio media
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  50 * 1024 * 1024,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/ogg'
  ]
);

-- Create storage policies for portfolio-media bucket
create policy "Public read access"
on storage.objects for select
using (bucket_id = 'portfolio-media');

create policy "Authenticated upload access"
on storage.objects for insert
with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

create policy "Authenticated update access"
on storage.objects for update
using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

create policy "Authenticated delete access"
on storage.objects for delete
using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- Create RLS policies for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- Create RLS policies for portfolio_items
alter table portfolio_items enable row level security;

create policy "Published portfolio items are viewable by everyone"
on portfolio_items for select
using (status = 'published');

create policy "Authenticated users can insert portfolio items"
on portfolio_items for insert
with check (auth.role() = 'authenticated');

create policy "Authenticated users can update portfolio items"
on portfolio_items for update
using (auth.role() = 'authenticated');

create policy "Admin users can delete portfolio items"
on portfolio_items for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Create RLS policies for categories
alter table categories enable row level security;

create policy "Categories are viewable by everyone"
on categories for select
using (true);

-- Create RLS policies for settings
alter table settings enable row level security;

create policy "Settings are viewable by everyone"
on settings for select
using (true);

create policy "Admin users can update settings"
on settings for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Create a default admin profile (will need to be updated after signup)
-- This is a placeholder - the actual profile should be created via a trigger

-- Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id, role, display_name, email)
  values (
    new.id,
    new.id,
    'admin',
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();