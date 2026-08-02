do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when others then
  raise notice 'Table messages already added to realtime or error occurred';
end $$;

do $$
begin
  alter publication supabase_realtime add table public.portfolio_items;
exception when others then
  raise notice 'Table portfolio_items already added to realtime or error occurred';
end $$;

do $$
begin
  alter publication supabase_realtime add table public.settings;
exception when others then
  raise notice 'Table settings already added to realtime or error occurred';
end $$;

do $$
begin
  alter publication supabase_realtime add table public.categories;
exception when others then
  raise notice 'Table categories already added to realtime or error occurred';
end $$;

do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception when others then
  raise notice 'Table profiles already added to realtime or error occurred';
end $$;
