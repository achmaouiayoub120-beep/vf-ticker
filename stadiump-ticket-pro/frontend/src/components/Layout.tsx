import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, logout } = useAuthStore();

  return (
    <>
      <header className="bg-maroc-rouge text-white shadow">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <Link to="/" className="text-xl font-bold">{t('appName')}</Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="hover:underline">{t('home')}</Link>
            <Link to="/matches" className="hover:underline">{t('matches')}</Link>
            {isLoggedIn ? (
              <button type="button" onClick={logout} className="hover:underline">{t('logout')}</button>
            ) : (
              <>
                <Link to="/login" className="hover:underline">{t('login')}</Link>
                <Link to="/register" className="hover:underline">{t('register')}</Link>
              </>
            )}
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-white text-gray-900 rounded px-2 py-1 text-sm"
            >
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-maroc-vert text-white py-4 text-center text-sm">
        {t('footer')}
      </footer>
    </>
  );
}
