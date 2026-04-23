import LegalLayout from '../../components/layout/LegalLayout';

export default function Confidentialite() {
  return (
    <LegalLayout
      kicker="Protection des données"
      title="Politique de confidentialité"
      lastUpdated="15 janvier 2026"
    >
      <section className="legal-section">
        <h2>Préambule</h2>
        <p>
          La Magie du Soir attache une importance particulière à la protection
          de vos données personnelles et s'engage à respecter la réglementation
          applicable, notamment le Règlement Général sur la Protection des
          Données (RGPD n° 2016/679) et la Loi Informatique et Libertés.
        </p>
      </section>

      <section className="legal-section">
        <h2>Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données est <strong>La Magie du Soir</strong>,
          dont le siège social est situé [Adresse].
        </p>
        <p>
          Pour toute question relative à la protection de vos données, vous
          pouvez contacter notre Délégué à la Protection des Données (DPO) :<br />
          Email : <a href="mailto:dpo@lamagiedusoir.fr">dpo@lamagiedusoir.fr</a>
        </p>
      </section>

      <section className="legal-section">
        <h2>Données collectées</h2>
        <p>Dans le cadre de nos services, nous collectons les données suivantes :</p>
        <ul>
          <li>Identité : nom, prénom</li>
          <li>Coordonnées : email, numéro de téléphone, adresse postale</li>
          <li>Données de réservation : type de billet, date d'achat, montant</li>
          <li>Données de paiement : traitées par nos prestataires certifiés (Fedapay, Stripe)</li>
          <li>Données de navigation : adresse IP, pages consultées, via cookies</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Finalités du traitement</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>La gestion de votre billetterie et l'envoi de vos e-billets</li>
          <li>La communication relative à l'événement</li>
          <li>La gestion de votre candidature artistique (le cas échéant)</li>
          <li>La réponse à vos demandes de contact ou de presse</li>
          <li>L'amélioration de nos services et l'analyse statistique</li>
          <li>Le respect de nos obligations légales et comptables</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Base légale et durée de conservation</h2>
        <p>
          Le traitement de vos données repose sur l'exécution du contrat, votre
          consentement, ou le respect d'obligations légales.
        </p>
        <p>
          Les données liées à votre billet sont conservées pendant la durée de
          l'événement, majorée de la durée de prescription légale (5 ans). Les
          données de prospection sont conservées 3 ans à compter de votre
          dernier contact.
        </p>
      </section>

      <section className="legal-section">
        <h2>Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez des droits suivants sur vos
          données :
        </p>
        <ul>
          <li>Droit d'accès et de rectification</li>
          <li>Droit à l'effacement (« droit à l'oubli »)</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d'opposition</li>
          <li>Droit à la portabilité</li>
          <li>Droit de retirer votre consentement à tout moment</li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez-nous à{' '}
          <a href="mailto:dpo@lamagiedusoir.fr">dpo@lamagiedusoir.fr</a>. Vous
          disposez également du droit d'introduire une réclamation auprès de la
          CNIL (<a href="https://www.cnil.fr">www.cnil.fr</a>).
        </p>
      </section>

      <section className="legal-section">
        <h2>Cookies</h2>
        <p>
          Notre site utilise des cookies strictement nécessaires au fonctionnement
          (session, sécurité) et, avec votre consentement, des cookies de mesure
          d'audience. Vous pouvez gérer vos préférences via le bandeau cookies
          présent sur le site.
        </p>
      </section>
    </LegalLayout>
  );
}
