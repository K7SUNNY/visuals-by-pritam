create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

alter table public.messages enable row level security;

create policy "Allow anyone to insert messages"
  on public.messages for insert
  to public
  with check (true);

create policy "Allow admins and editors to read messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'editor')
    )
  );

create policy "Allow admins and editors to update messages"
  on public.messages for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'editor')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'editor')
    )
  );

create policy "Allow admins to delete messages"
  on public.messages for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role = 'admin'
    )
  );