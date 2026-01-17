import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function QuienSoyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-lego-bg via-white to-lego-yellow-50 min-h-screen">
      {/* Floating bricks */}
      <div className="pointer-events-none absolute inset-0 select-none opacity-10">
        <div className="absolute left-6 top-10 text-6xl animate-bounce">🧱</div>
        <div className="absolute right-10 top-24 text-5xl animate-pulse">🟨</div>
        <div className="absolute right-14 bottom-16 text-6xl animate-bounce">🟥</div>
        <div className="absolute left-16 bottom-20 text-5xl animate-pulse">🟦</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.25em] text-xs sm:text-sm text-lego-red font-semibold mb-3">
            {t('footer.My Story')}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-lego-dark">
            {t('myStory.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-lego-yellow/70 via-white to-lego-blue/50 blur-3xl animate-pulse" />
            <div className="relative rounded-3xl bg-white p-3 shadow-2xl ring-4 ring-lego-red/20">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-builder-kid.jpg"
                  alt="Kid building a colorful LEGO stadium"
                  width={900}
                  height={1100}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Sticker */}
              <div className="absolute -bottom-6 -left-4 bg-lego-yellow text-lego-dark px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 font-heading font-semibold">
                <span className="text-xl">🎯</span>
                {t('myStory.machinesBuilder')}
              </div>
              <div className="absolute -top-5 right-4 bg-white px-3 py-2 rounded-xl shadow-md border border-lego-blue/30 text-sm font-semibold text-lego-blue">
                {t('myStory.footballFan')}
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-lego-yellow/30 animate-in" style={{ animationDelay: "120ms" }}>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                {t('myStory.intro')}
              </p>
              <p>
                {t('myStory.passion')}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-lego-yellow/20 border border-lego-yellow/50 p-4 flex items-start gap-3">
                <span className="text-2xl">🧱</span>
                <div>
                  <p className="text-sm font-semibold text-lego-dark">{t('myStory.brickCountTitle')}</p>
                  <p className="text-sm text-gray-600">{t('myStory.brickCountDesc')}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-lego-blue/15 border border-lego-blue/40 p-4 flex items-start gap-3">
                <span className="text-2xl">⚽</span>
                <div>
                  <p className="text-sm font-semibold text-lego-dark">{t('myStory.playtimeTitle')}</p>
                  <p className="text-sm text-gray-600">{t('myStory.playtimeDesc')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-lego-red text-white text-sm font-semibold shadow-md">{t('myStory.age')}</span>
              <span className="px-4 py-2 rounded-full bg-lego-blue text-white text-sm font-semibold shadow-md">{t('myStory.grade')}</span>
              <span className="px-4 py-2 rounded-full bg-lego-blue text-white text-sm font-semibold shadow-md">{t('myStory.masterBuilder')}</span>
              <span className="px-4 py-2 rounded-full bg-lego-yellow text-lego-dark text-sm font-semibold shadow-md">{t('myStory.footballFan')}</span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/#gallery" className="btn-primary">
                {t('myStory.seeCreations')}
              </Link>
              <Link href="/support" className="btn-outline">
                {t('myStory.supportBuilds')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
