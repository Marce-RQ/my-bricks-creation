import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BuildCard from '@/components/BuildCard';
import type { PostWithImages } from '@/lib/types';

async function getPosts(): Promise<PostWithImages[]> {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !posts) {
    console.error('Error fetching posts:', error);
    return [];
  }

  // Get images for each post
  const postsWithImages = await Promise.all(
    posts.map(async (post) => {
      const { data: images } = await supabase
        .from('post_images')
        .select('*')
        .eq('post_id', post.id)
        .order('display_order', { ascending: true });

      return {
        ...post,
        images: images || [],
      };
    })
  );

  return postsWithImages;
}

export default async function MainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const posts = await getPosts();

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION - Split Layout */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-lego-bg via-white to-lego-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Avatar */}
            <div className="flex flex-col items-center lg:items-center order-1 animate-in">
              {/* Avatar with colored border */}
              <div className="relative">
                {/* Decorative squares with bounce animation */}
                <div
                  className="absolute -top-4 -left-4 w-8 h-8 bg-lego-red rounded-lg rotate-12 opacity-80 animate-bounce"
                  style={{ animationDuration: '2s' }}
                />
                <div
                  className="absolute -bottom-3 -right-3 w-6 h-6 bg-lego-blue rounded-lg -rotate-12 opacity-80 animate-bounce"
                  style={{
                    animationDuration: '2.3s',
                    animationDelay: '0.2s',
                  }}
                />
                <div
                  className="absolute top-5 -right-6 w-5 h-5 bg-green-500 rounded-lg rotate-45 opacity-90 animate-bounce"
                  style={{
                    animationDuration: '1.8s',
                    animationDelay: '0.4s',
                  }}
                />
                <div
                  className="absolute -top-6 right-8 w-5 h-5 bg-red-500 rounded-lg -rotate-6 opacity-90 animate-bounce"
                  style={{
                    animationDuration: '2.1s',
                    animationDelay: '0.3s',
                  }}
                />
                <div
                  className="absolute top-1/4 -left-6 w-6 h-6 bg-cyan-400 rounded-lg rotate-[30deg] opacity-80 animate-bounce"
                  style={{
                    animationDuration: '2.5s',
                    animationDelay: '0.5s',
                  }}
                />
                <div
                  className="absolute bottom-1/4 -left-8 w-5 h-5 bg-green-500 rounded-lg -rotate-[20deg] opacity-90 animate-bounce"
                  style={{
                    animationDuration: '1.9s',
                    animationDelay: '0.1s',
                  }}
                />
                <div
                  className="absolute -bottom-5 left-1/4 w-5 h-5 bg-cyan-400 rounded-lg rotate-[15deg] opacity-80 animate-bounce"
                  style={{
                    animationDuration: '2.2s',
                    animationDelay: '0.6s',
                  }}
                />

                {/* Main avatar container */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  {/* Outer gradient ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lego-yellow via-yellow-400 to-lego-red p-1.5 shadow-2xl">
                    {/* White ring */}
                    <div className="w-full h-full rounded-full bg-white p-1.5">
                      {/* Avatar */}
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src="/avatar.svg"
                          alt="Young Master Builder"
                          width={400}
                          height={400}
                          className="object-cover w-full h-full"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div
              className="order-2 text-center lg:text-left animate-in"
              style={{ animationDelay: '100ms' }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-heading font-bold text-lego-dark mb-4 sm:mb-6 leading-tight">
                {t('hero.greeting')}{' '}
                <span className="text-gradient inline-block">
                  {t('hero.title')}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="#gallery" className="btn-primary">
                  {t('hero.exploreGallery')}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Link>
                <Link href="/quien-soy" className="btn-outline group">
                  <span className="w-[26px] h-[26px] inline-flex items-center justify-center">
                    <span className="group-hover:hidden text-lg">👤</span>
                    <Image
                      src="/smiley-lego.png"
                      alt="Smiley Lego"
                      width={26}
                      height={26}
                      className="hidden group-hover:inline-block"
                    />
                  </span>
                  {t('hero.whoAmI')}
                </Link>
              </div>

              {/* Stats */}
              {posts.length > 0 && (
                <div className="flex gap-8 justify-center lg:justify-start mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                  <div>
                    <p
                      aria-label="creation-counter"
                      className="text-2xl sm:text-3xl font-heading font-bold text-lego-dark text-center"
                    >
                      {posts.length}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                      {t('hero.creations')}
                    </p>
                  </div>
                  <div>
                    <p
                      aria-label="pieces-counter"
                      className="text-2xl sm:text-3xl font-heading font-bold text-lego-dark text-center"
                    >
                      {posts
                        .reduce((acc, post) => acc + (post.piece_count || 0), 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                      {t('hero.totalPieces')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-4xl mb-4 animate-float">✨</span>
            <h2 className="section-heading">{t('gallery.title')}</h2>
            <p className="section-subheading">{t('gallery.subtitle')}</p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <BuildCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div
                className="inline-flex items-center justify-center w-24 h-24 
                            bg-lego-bg rounded-full mb-6"
              >
                <span className="text-5xl animate-float">🏗️</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-lego-dark mb-3">
                {t('gallery.emptyTitle')}
              </h3>
              <p className="text-lg text-gray-500 max-w-md mx-auto">
                {t('gallery.emptyDescription')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-lego-dark via-gray-900 to-lego-dark relative overflow-hidden">
        {/* Decorative bricks */}
        <div className="absolute top-10 left-10 text-6xl opacity-10">🧱</div>
        <div className="absolute bottom-10 right-10 text-8xl opacity-10">
          🧱
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-5xl mb-6 block">❤️</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            {t('cta.description')}
          </p>
          <Link
            href="/support"
            className="btn-primary bg-lego-yellow text-lego-dark hover:bg-lego-yellow-300"
          >
            {t('cta.button')}
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
