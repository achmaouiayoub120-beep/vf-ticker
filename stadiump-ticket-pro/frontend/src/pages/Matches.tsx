import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  base_price: number;
  stadium?: { name: string; city: string };
  availability?: { available: number; total: number };
}

export default function Matches() {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/matches')
      .then((r) => r.json())
      .then((data) => { setMatches(Array.isArray(data) ? data : []); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Chargement…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroc-rouge mb-6">{t('matches')}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <p className="font-semibold text-lg">
              {m.home_team} – {m.away_team}
            </p>
            <p className="text-sm text-gray-600">
              {m.stadium?.name} · {m.stadium?.city}
            </p>
            <p className="text-sm">
              {new Date(m.match_date).toLocaleDateString()} · Base {m.base_price} MAD
            </p>
            {m.availability && (
              <p className="text-xs text-gray-500">
                {m.availability.available} / {m.availability.total} places
              </p>
            )}
            <Link
              to={`/matches/${m.id}/seats`}
              className="mt-2 inline-block bg-maroc-vert text-white px-4 py-2 rounded text-sm hover:opacity-90"
            >
              {t('selectSeats')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
