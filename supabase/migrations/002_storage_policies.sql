-- Create storage bucket for build images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('build-images', 'build-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public can view build images" ON storage.objects
  FOR SELECT USING (bucket_id = 'build-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'build-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'build-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'build-images' 
    AND auth.role() = 'authenticated'
  );
