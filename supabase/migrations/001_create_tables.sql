-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  piece_count INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  date_start TIMESTAMPTZ,
  date_completed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Indexes for posts
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_slug ON posts(slug);

-- Create post_images table
CREATE TABLE post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for post_images
CREATE INDEX idx_post_images_post_id ON post_images(post_id);
CREATE INDEX idx_post_images_display_order ON post_images(display_order);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;

-- Posts RLS Policies
-- Public can view published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published');

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Post Images RLS Policies
-- Public can view images of published posts
CREATE POLICY "Public can view published post images" ON post_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_images.post_id
      AND posts.status = 'published'
    )
  );

-- Authenticated users can manage all images
CREATE POLICY "Authenticated users full access" ON post_images
  FOR ALL USING (auth.role() = 'authenticated');
