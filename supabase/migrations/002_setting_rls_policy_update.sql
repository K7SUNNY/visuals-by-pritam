-- Allow read access to anyone
CREATE POLICY "Allow public read access"
ON public.settings FOR SELECT
USING (true);

-- Allow authenticated users (admin) to update settings
CREATE POLICY "Allow authenticated users to update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users (admin) to insert settings
CREATE POLICY "Allow authenticated users to insert settings"
ON public.settings FOR INSERT
TO authenticated
WITH CHECK (true);