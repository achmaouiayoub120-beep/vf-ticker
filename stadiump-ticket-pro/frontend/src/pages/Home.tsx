import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTerrainGalleryUrls } from '../lib/stadiumImages';

export default function Home() {
  const { t } = useTranslation();
  const gallery = getTerrainGalleryUrls();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-maroc-rouge mb-4">{t('appName')}</h1>
        <p className="text-gray-700 mb-6">{t('searchMatches')}</p>
        <Link
          to="/matches"
          className="inline-block bg-maroc-vert text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
        >
          {t('matches')}
        </Link>
      </div>
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-maroc-rouge mb-4 text-center">Terrains &amp; stades</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {gallery.map((src, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow border border-gray-200 aspect-[4/3] bg-gray-100">
              <img
                src={src}
                alt={`Terrain ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
