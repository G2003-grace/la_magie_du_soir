import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTopAppBar from '../../components/layout/AdminTopAppBar';

const REQUIREMENTS = [
  {
    icon: '/images/icon-shield-check.svg',
    title: 'Accréditation 2026',
    text: "Être accrédité spécifiquement pour l'édition prestige 2026.",
  },
  {
    icon: '/images/icon-key.svg',
    title: "Clé d'Excellence",
    text: "Posséder une clé d'accès numérique valide et non expirée.",
  },
  {
    icon: '/images/icon-eye-off.svg',
    title: 'Confidentialité',
    text: 'Respecter la confidentialité absolue des données du gala.',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      setError("La clé d'accès est requise.");
      return;
    }
    localStorage.setItem('admin-token', '1');
    navigate('/admin/dashboard');
  };

  return (
    <>
      <AdminTopAppBar />

      <main className="admin-login">
        <div className="admin-login__bg" aria-hidden="true">
          <img src="/images/admin-bg-curtain.png" alt="" />
          <div className="admin-login__bg-overlay" />
        </div>

        <div className="admin-login__grid">
          {/* ─── LEFT ─── */}
          <section className="admin-login__left">
            <img
              src="/images/admin-emblem.jpg"
              alt="Emblème La Magie du Soir"
              className="admin-login__emblem"
            />
            <h1 className="admin-login__title">
              Conditions<br />d'Accès<br />&amp; Protocole
            </h1>
            <p className="admin-login__desc">
              L'accès à l'administration est réservé aux membres du comité
              d'organisation ayant prêté serment d'excellence.
            </p>
            <ul className="admin-login__requirements">
              {REQUIREMENTS.map(r => (
                <li key={r.title}>
                  <img src={r.icon} alt="" />
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ─── RIGHT (card) ─── */}
          <section className="admin-login__card">
            <span className="admin-login__corner" aria-hidden="true" />

            <header className="admin-login__card-head">
              <span className="admin-login__kicker">Portail restreint</span>
              <h2 className="admin-login__card-title">Identification</h2>
            </header>

            <form onSubmit={handleSubmit} className="admin-login__form">
              <div className="admin-login__field">
                <label className="admin-login__label">Clé d'accès</label>
                <div className="admin-login__input-wrap">
                  <input
                    type="password"
                    value={accessKey}
                    onChange={e => {
                      setAccessKey(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="••••••••••••"
                    className={`admin-login__input ${error ? 'admin-login__input--error' : ''}`}
                    autoComplete="current-password"
                  />
                  <img
                    src="/images/icon-key-input.svg"
                    alt=""
                    className="admin-login__input-icon"
                  />
                </div>
                {error && <span className="admin-login__error">{error}</span>}
              </div>

              <button type="submit" className="admin-login__submit">
                Initialiser la session
              </button>
            </form>

            <aside className="admin-login__warning">
              <img
                src="/images/icon-warning.svg"
                alt=""
                className="admin-login__warning-icon"
              />
              <p>
                Attention : sans cette clé d'accès, l'accès vous est strictement
                refusé pour des raisons de sécurité.
              </p>
            </aside>
          </section>
        </div>
      </main>

      <footer className="admin-login__footer">
        <span>© 2026 La Magie du Soir. Tous droits réservés.</span>
        <nav>
          <a href="#">Support</a>
          <a href="#">Confidentialité</a>
        </nav>
      </footer>
    </>
  );
}
