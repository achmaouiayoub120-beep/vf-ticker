import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nom, prenom: prenom || undefined, email, password }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.id) navigate('/login');
        else setError(data.message || 'Erreur');
      })
      .catch(() => setError('Erreur réseau'));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-maroc-rouge mb-4">{t('register')}</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('nom')}</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('prenom')}</label>
          <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('email')}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required minLength={8} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-maroc-vert text-white py-2 rounded font-medium">{t('register')}</button>
      </form>
      <Link to="/login" className="text-maroc-vert underline mt-4 inline-block">{t('login')}</Link>
    </div>
  );
}
