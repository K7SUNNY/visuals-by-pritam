create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamp with time zone default now() not null
);

alter table public.messages enable row level security;

create policy "Allow authenticated users to read messages"
  on public.messages for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert messages"
  on public.messages for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update messages"
  on public.messages for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users to delete messages"
  on public.messages for delete
  to authenticated
  using (true);