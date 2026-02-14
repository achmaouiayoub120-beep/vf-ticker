import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.accessToken) {
          setToken(data.accessToken);
          navigate('/matches');
        } else setError(data.message || 'Erreur connexion');
      })
      .catch(() => setError('Erreur réseau'));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-maroc-rouge mb-4">{t('login')}</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-maroc-vert text-white py-2 rounded font-medium">
          {t('login')}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        {t('demoAccounts')}: admin1@stadium.ma / DemoAdmin1!
      </p>
      <Link to="/register" className="text-maroc-vert underline mt-2 inline-block">{t('register')}</Link>
    </div>
  );
}
