import LoginForm from '@/components/LoginForm';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Admin Login | MyBricksCreations',
};

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('login');
  const tAdmin = await getTranslations('admin');

  return (
    <div className="bg-lego-bg py-4 px-4 flex-grow">
      <div className="max-w-md w-full mx-auto pt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-lego-dark">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">{tAdmin('signInToManage')}</p>
        </div>

        <div className="bg-white rounded-card shadow-card p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
