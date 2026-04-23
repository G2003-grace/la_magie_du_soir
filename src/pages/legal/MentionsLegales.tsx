import LegalLayout from '../../components/layout/LegalLayout';

export default function MentionsLegales() {
  return (
    <LegalLayout
      kicker="Informations légales"
      title="Mentions légales"
      lastUpdated="15 janvier 2026"
    >
      <section className="legal-section">
        <h2>Éditeur du site</h2>
        <p>
          Le site <strong>La Magie du Soir</strong> est édité par la société
          [Raison sociale de l'éditeur], [forme juridique] au capital de [montant] €,
          immatriculée au Registre du Commerce et des Sociétés de [ville] sous le
          numéro [RCS XXXXXXXXX].
        </p>
        <p>
          Siège social : [Adresse complète]<br />
          Téléphone : [+33 X XX XX XX XX]<br />
          Email : <a href="mailto:contact@lamagiedusoir.fr">contact@lamagiedusoir.fr</a><br />
          Numéro de TVA intracommunautaire : [FR XX XXX XXX XXX]
        </p>
      </section>

      <section className="legal-section">
        <h2>Directeur de la publication</h2>
        <p>
          [Nom et prénom du directeur de la publication], en qualité de
          [fonction exercée].
        </p>
      </section>

      <section className="legal-section">
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par [Nom de l'hébergeur], [forme juridique] dont le
          siège social est situé [Adresse de l'hébergeur].
        </p>
        <p>Téléphone : [+XX X XX XX XX XX]</p>
      </section>

      <section className="legal-section">
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu présent sur ce site (textes, images, vidéos,
          graphismes, logos, icônes, sons, logiciels) est la propriété exclusive
          de La Magie du Soir, sauf mention contraire explicite.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication ou
          adaptation de tout ou partie des éléments du site, quel que soit le
          moyen ou le procédé utilisé, est interdite sans autorisation écrite
          préalable.
        </p>
      </section>

      <section className="legal-section">
        <h2>Données personnelles</h2>
        <p>
          La gestion des données personnelles collectées sur ce site fait l'objet
          d'une politique dédiée, consultable sur notre page{' '}
          <a href="/confidentialite">Politique de confidentialité</a>.
        </p>
      </section>

      <section className="legal-section">
        <h2>Crédits</h2>
        <p>
          Conception et développement : [Agence / Freelance]<br />
          Direction artistique : [Nom]<br />
          Photographies : [Studio / Photographes]<br />
          Typographies : Playfair Display, Noto Serif, Manrope, Libre Baskerville
          (Google Fonts)
        </p>
      </section>
    </LegalLayout>
  );
}
