import { Link, Navigate, useLocation } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';

interface ConfirmationState {
  firstName: string;
  lastName: string;
  email: string;
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#f7bd48" fillOpacity="0.12" stroke="#f7bd48" strokeWidth="1.5" />
      <path d="M8 12.5l3 3 5-6" stroke="#f7bd48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CandidaterConfirmation() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;

  if (!state || !state.firstName) {
    return <Navigate to="/candidater" replace />;
  }

  return (
    <>
      <TopNavBar />

      <main className="candidater-confirmation">
        <section className="candidater-confirmation__card">
          <SuccessIcon />
          <h1 className="candidater-confirmation__title">
            Merci, {state.firstName} !
          </h1>
          <p className="candidater-confirmation__lead">
            Votre candidature a bien été reçue.
          </p>
          <p className="candidater-confirmation__text">
            Notre jury artistique examinera votre dossier dans les prochaines
            semaines. Vous recevrez notre retour à l'adresse{' '}
            <strong>{state.email || 'indiquée'}</strong>.
          </p>

          <div className="candidater-confirmation__actions">
            <Link to="/" className="candidater-confirmation__btn-primary">
              Retour à l'accueil
            </Link>
            <Link to="/programme" className="candidater-confirmation__btn-link">
              Découvrir le programme
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
