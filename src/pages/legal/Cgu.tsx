import LegalLayout from '../../components/layout/LegalLayout';

export default function Cgu() {
  return (
    <LegalLayout
      kicker="Utilisation du site"
      title="Conditions générales d'utilisation"
      lastUpdated="15 janvier 2026"
    >
      <section className="legal-section">
        <h2>Article 1 — Objet</h2>
        <p>
          Les présentes conditions générales d'utilisation (« CGU ») régissent
          l'accès et l'usage du site <strong>lamagiedusoir.fr</strong> par tout
          internaute (« l'Utilisateur »). Toute navigation sur le site implique
          l'acceptation pleine et entière des présentes CGU.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 2 — Accès au service</h2>
        <p>
          Le site est accessible gratuitement à tout Utilisateur disposant d'un
          accès à Internet. Les frais liés à cet accès (abonnement, matériel)
          restent à la charge de l'Utilisateur.
        </p>
        <p>
          L'éditeur se réserve le droit, sans préavis ni indemnité, de suspendre
          temporairement ou définitivement le site pour maintenance ou mise à
          jour.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 3 — Compte administrateur</h2>
        <p>
          L'accès à l'espace d'administration (<code>/admin</code>) est
          strictement réservé au personnel autorisé, muni d'une clé d'accès
          numérique délivrée par La Magie du Soir. Toute tentative d'accès non
          autorisé est passible de sanctions pénales.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 4 — Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus (textes, images, vidéos, logos, musiques)
          accessibles sur le site sont protégés par le droit d'auteur et le
          droit des marques. Toute reproduction, même partielle, est interdite
          sans autorisation écrite préalable.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 5 — Responsabilité</h2>
        <p>
          L'Utilisateur reconnaît utiliser le site sous sa responsabilité
          exclusive. La Magie du Soir ne saurait être tenue responsable :
        </p>
        <ul>
          <li>Des dommages directs ou indirects liés à l'utilisation du site</li>
          <li>D'une indisponibilité temporaire du service</li>
          <li>Du contenu de sites tiers accessibles via des liens hypertextes</li>
          <li>De la présence de virus ou de logiciels malveillants tiers</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Article 6 — Liens externes</h2>
        <p>
          Le site peut contenir des liens vers des sites tiers (réseaux sociaux,
          partenaires, prestataires de paiement). La Magie du Soir n'exerce
          aucun contrôle sur ces sites et décline toute responsabilité quant à
          leur contenu ou leurs pratiques de confidentialité.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 7 — Modification des CGU</h2>
        <p>
          Les présentes CGU peuvent être modifiées à tout moment. Les
          modifications prennent effet dès leur publication sur le site. Il est
          recommandé à l'Utilisateur de consulter régulièrement cette page.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 8 — Loi applicable et juridiction</h2>
        <p>
          Les présentes CGU sont régies par le droit français. Tout litige
          relatif à leur interprétation ou leur exécution relève de la
          compétence exclusive des tribunaux français.
        </p>
      </section>
    </LegalLayout>
  );
}
