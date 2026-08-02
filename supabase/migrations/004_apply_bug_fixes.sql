-- Re-apply settings RLS updates
DROP POLICY IF EXISTS "Allow authenticated users to update settings" ON public.settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admins to update settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admins to insert settings" ON public.settings;

CREATE POLICY "Allow admins to update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (
  exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.role = 'admin'
  )
)
WITH CHECK (
  exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.role = 'admin'
  )
);

CREATE POLICY "Allow admins to insert settings"
ON public.settings FOR INSERT
TO authenticated
WITH CHECK (
  exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.role = 'admin'
  )
);

-- Re-apply portfolio_items RLS updates
DROP POLICY IF EXISTS "Published portfolio items are viewable by everyone" ON public.portfolio_items;

CREATE POLICY "Published portfolio items are viewable by everyone"
ON public.portfolio_items FOR SELECT
USING (status = 'published' or auth.role() = 'authenticated');

-- Re-apply profiles user_id cleanup
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_id;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name, email)
  VALUES (
    new.id,
    'admin',
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply messages table updates
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone default now() not null;

DROP POLICY IF EXISTS "Allow authenticated users to read messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to update messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated users to delete messages" ON public.messages;
DROP POLICY IF EXISTS "Allow anyone to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admins and editors to read messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admins and editors to update messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admins to delete messages" ON public.messages;

CREATE POLICY "Allow anyone to insert messages"
  ON public.messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow admins and editors to read messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admins and editors to update messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'editor')
    )
  )
  WITH CHECK (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'editor')
    )
  );

CREATE POLICY "Allow admins to delete messages"
  ON public.messages FOR DELETE
  TO authenticated
  USING (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role = 'admin'
    )
  );
