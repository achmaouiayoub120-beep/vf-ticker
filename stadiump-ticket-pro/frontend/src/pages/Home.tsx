import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-maroc-rouge mb-4">{t('appName')}</h1>
      <p className="text-gray-700 mb-6">{t('searchMatches')}</p>
      <Link
        to="/matches"
        className="inline-block bg-maroc-vert text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
      >
        {t('matches')}
      </Link>
    </div>
  );
}
