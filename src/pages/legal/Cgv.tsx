import LegalLayout from '../../components/layout/LegalLayout';

export default function Cgv() {
  return (
    <LegalLayout
      kicker="Billetterie"
      title="Conditions générales de vente"
      lastUpdated="15 janvier 2026"
    >
      <section className="legal-section">
        <h2>Article 1 — Préambule</h2>
        <p>
          Les présentes conditions générales de vente (« CGV ») régissent les
          ventes de billets pour l'événement <strong>La Magie du Soir 2026</strong>{' '}
          effectuées via le site <strong>lamagiedusoir.fr</strong>. Toute
          commande implique l'acceptation pleine et entière des CGV en vigueur
          à la date de la commande.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 2 — Commande</h2>
        <p>
          La commande est validée après :
        </p>
        <ul>
          <li>Sélection d'une catégorie de billet (Standard, VIP, Prestige)</li>
          <li>Saisie des coordonnées du titulaire</li>
          <li>Choix du mode de paiement (MTN Money, Moov Money, Carte bancaire)</li>
          <li>Paiement intégral du montant via le prestataire sécurisé</li>
        </ul>
        <p>
          La confirmation de la commande est adressée par email dans un délai
          de quelques minutes, accompagnée du billet électronique (QR Code).
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 3 — Prix et paiement</h2>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises (TTC). Ils
          peuvent évoluer en fonction des quotas disponibles mais restent
          fermes pour toute commande validée.
        </p>
        <p>
          Le paiement est intégral à la commande. Les transactions sont
          sécurisées par nos prestataires certifiés PCI-DSS (Fedapay, Stripe).
          Aucune donnée bancaire n'est stockée par La Magie du Soir.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 4 — Livraison des billets</h2>
        <p>
          Les billets sont livrés exclusivement sous forme électronique (PDF +
          QR Code) par email à l'adresse renseignée lors de la commande.
          Aucune version papier n'est envoyée.
        </p>
        <p>
          En cas de non-réception dans les 24 heures suivant le paiement,
          contactez{' '}
          <a href="mailto:billetterie@lamagiedusoir.fr">billetterie@lamagiedusoir.fr</a>.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 5 — Droit de rétractation</h2>
        <p>
          Conformément à l'article L221-28 du Code de la consommation, les
          prestations de services d'activités de loisirs fournies à une date
          déterminée ne sont pas soumises au droit de rétractation.
        </p>
        <p>
          En conséquence, <strong>aucun remboursement ne peut être exigé</strong>{' '}
          une fois la commande validée, sauf annulation de l'événement par
          l'organisateur.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 6 — Annulation de l'événement</h2>
        <p>
          En cas d'annulation totale de l'événement imputable à l'organisateur,
          le remboursement intégral est effectué sous 30 jours. En cas de
          report, le billet reste valable pour la nouvelle date communiquée.
        </p>
        <p>
          Les cas de force majeure (intempéries, décision administrative,
          pandémie) peuvent entraîner un report sans ouverture de droit à
          remboursement.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 7 — Cession du billet</h2>
        <p>
          Le billet est nominatif et associé à l'acheteur initial. Toute revente
          à un tiers à un prix supérieur au prix facial est strictement interdite
          et constitue une infraction (Loi du 27 juin 1919, article 313-6-2 du
          Code pénal).
        </p>
        <p>
          La cession gratuite à un proche est autorisée, à condition de
          transmettre l'identité du nouveau détenteur à l'adresse{' '}
          <a href="mailto:billetterie@lamagiedusoir.fr">billetterie@lamagiedusoir.fr</a>{' '}
          avant l'événement.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 8 — Accès à l'événement</h2>
        <p>
          L'accès au gala est conditionné à la présentation d'une pièce
          d'identité et du QR Code du billet. L'organisateur se réserve le
          droit de refuser l'entrée à toute personne dont le comportement
          serait contraire au règlement intérieur ou à la sécurité de
          l'événement.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 9 — Responsabilité</h2>
        <p>
          La Magie du Soir ne saurait être tenue responsable des dommages
          indirects (perte de gain, perte de données) consécutifs à
          l'utilisation ou à l'impossibilité d'utiliser le service de
          billetterie.
        </p>
      </section>

      <section className="legal-section">
        <h2>Article 10 — Loi applicable et litiges</h2>
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige,
          une solution amiable est recherchée en priorité via notre service
          client. À défaut, les tribunaux français sont seuls compétents.
        </p>
      </section>
    </LegalLayout>
  );
}
