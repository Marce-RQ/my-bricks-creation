-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view build images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;

-- Allow public access to view images (SELECT)
CREATE POLICY "Public can view build images" ON storage.objects
  FOR SELECT 
  TO public
  USING (bucket_id = 'build-images');

-- Allow authenticated users to upload images (INSERT)
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'build-images');

-- Allow authenticated users to delete images (DELETE)
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'build-images');

-- Allow authenticated users to update images (UPDATE)
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'build-images');
