import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { getAuthToken } from '../stores/authStore';
import SeatMap from '../components/SeatMap';
import { api } from '../lib/api';

interface SeatData {
  id: number;
  zone_id: number;
  row: string;
  number: number;
  status: string;
  price: number;
}
interface SeatsResponse {
  match: { id: number; home_team: string; away_team: string; match_date: string; base_price: number };
  zones: { id: number; name: string; price_multiplier: number }[];
  seats: SeatData[];
}

export default function MatchSeats() {
  const { matchId } = useParams<{ matchId: string }>();
  const { t } = useTranslation();
  const { isLoggedIn } = useAuthStore();
  const [data, setData] = useState<SeatsResponse | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [lockToken, setLockToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!matchId) return;
    api(`/api/matches/${matchId}/seats`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Erreur chargement'))
      .finally(() => setLoading(false));
  }, [matchId]);

  const handleLock = () => {
    if (!isLoggedIn || !matchId || selected.length === 0) return;
    const token = getAuthToken();
    api('/api/orders/lock', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ matchId: parseInt(matchId, 10), seats: selected }),
    })
      .then((r) => r.json())
      .then((res) => { if (res.lockToken) setLockToken(res.lockToken); })
      .catch(() => setError('Échec réservation'));
  };

  const handleCheckout = () => {
    if (!lockToken) return;
    const token = getAuthToken();
    setCheckoutLoading(true);
    api('/api/payments/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ lockToken }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setOrderId(data.orderId);
          setError(null);
        } else setError(data.message || 'Erreur checkout');
      })
      .catch(() => setError('Erreur paiement'))
      .finally(() => setCheckoutLoading(false));
  };

  if (loading) return <p>Chargement…</p>;
  if (error || !data) return <p>{error || 'Aucune donnée'}</p>;

  const total = data.seats
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroc-rouge mb-2">
        {data.match.home_team} – {data.match.away_team}
      </h1>
      <p className="text-gray-600 mb-4">{t('selectSeats')}</p>
      <SeatMap
        seats={data.seats}
        zones={data.zones}
        selected={selected}
        onSelect={(id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))}
      />
      <div className="mt-6 flex items-center gap-4 flex-wrap">
        <span className="font-semibold">{t('total')}: {total.toFixed(2)} MAD</span>
        {!isLoggedIn && <p className="text-amber-700">Connectez-vous pour réserver.</p>}
        {isLoggedIn && selected.length > 0 && !lockToken && (
          <button
            type="button"
            onClick={handleLock}
            className="bg-maroc-vert text-white px-4 py-2 rounded hover:opacity-90"
          >
            {t('lockSeats')}
          </button>
        )}
        {lockToken && (
          <>
            <p className="text-maroc-vert font-medium">Réservation OK. Passez au paiement.</p>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="bg-maroc-rouge text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
            >
              {checkoutLoading ? '…' : t('checkout')}
            </button>
          </>
        )}
        {orderId && <p className="text-maroc-vert font-medium">Commande #{orderId} créée. Complétez le paiement Stripe (webhook marquera la commande payée).</p>}
      </div>
    </div>
  );
}
