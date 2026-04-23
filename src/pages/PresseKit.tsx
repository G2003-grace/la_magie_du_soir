import LegalLayout from '../components/layout/LegalLayout';

const DOWNLOADS = [
  {
    name: 'Dossier de presse complet',
    format: 'PDF',
    size: '12.4 MB',
    desc: "Présentation détaillée de l'événement, biographies, programme, contacts.",
    href: '#',
  },
  {
    name: 'Logos & charte graphique',
    format: 'ZIP',
    size: '5.8 MB',
    desc: 'Logos officiels (vectoriels et bitmap), charte couleurs, typographies.',
    href: '#',
  },
  {
    name: 'Photos haute définition',
    format: 'ZIP',
    size: '48 MB',
    desc: 'Sélection de 40 photos HD des éditions précédentes, libres de droit éditorial.',
    href: '#',
  },
  {
    name: 'Communiqué de presse',
    format: 'DOCX',
    size: '1.2 MB',
    desc: "Communiqué officiel de l'édition 2026, prêt à être reprise.",
    href: '#',
  },
];

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function PresseKit() {
  return (
    <LegalLayout
      kicker="Ressources presse"
      title="Dossier de presse"
      lastUpdated="15 janvier 2026"
    >
      <section className="legal-section">
        <p>
          Retrouvez ci-dessous l'ensemble des ressources mises à disposition des
          journalistes, partenaires et diffuseurs pour couvrir l'édition 2026 du
          gala <strong>La Magie du Soir</strong>.
        </p>
        <p>
          Tous les fichiers sont libres d'usage dans un cadre strictement
          éditorial, avec mention obligatoire du crédit : « © La Magie du Soir 2026 ».
        </p>
      </section>

      <div className="presse-kit__downloads">
        {DOWNLOADS.map(d => (
          <a key={d.name} href={d.href} className="presse-kit__item">
            <div className="presse-kit__item-head">
              <span className="presse-kit__format">{d.format}</span>
              <span className="presse-kit__size">{d.size}</span>
            </div>
            <h3 className="presse-kit__name">{d.name}</h3>
            <p className="presse-kit__desc">{d.desc}</p>
            <div className="presse-kit__download">
              <DownloadIcon />
              <span>Télécharger</span>
            </div>
          </a>
        ))}
      </div>

      <section className="legal-section">
        <h2>Contact presse</h2>
        <p>
          Pour toute demande spécifique (interview, accréditation, accès coulisses),
          contactez notre service presse :
        </p>
        <p>
          Email : <a href="mailto:presse@lamagiedusoir.fr">presse@lamagiedusoir.fr</a><br />
          Téléphone : <a href="tel:+33142567890">+33 (0)1 42 56 78 90</a><br />
          Disponible du lundi au vendredi, 10h — 19h (CET).
        </p>
      </section>
    </LegalLayout>
  );
}
