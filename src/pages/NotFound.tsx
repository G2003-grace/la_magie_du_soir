import { Link } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <TopNavBar />

      <main className="not-found">
        <div className="not-found__content">
          <h1 className="not-found__code">404</h1>
          <div className="not-found__divider" />
          <h2 className="not-found__title">Page introuvable</h2>
          <p className="not-found__desc">
            La page que vous recherchez semble s'être évanouie dans les coulisses
            du gala. Peut-être avez-vous suivi un lien rompu ou saisi une adresse
            incorrecte.
          </p>
          <Link to="/" className="btn-ghost">Retour à l'accueil</Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
