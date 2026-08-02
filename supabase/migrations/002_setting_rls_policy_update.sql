-- Allow read access to anyone
CREATE POLICY "Allow public read access"
ON public.settings FOR SELECT
USING (true);

-- Allow admins to update settings
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

-- Allow admins to insert settings
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