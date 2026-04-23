import { useRef, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useCms } from '../../context/CmsContext';

type PageKey = 'accueil' | 'about' | 'press';

interface PageCard {
  key: PageKey;
  iconType: 'home' | 'info' | 'news';
  title: string;
  lastModified: string;
  badge: { label: string; variant: 'gold' | 'grey' } | null;
  label: string;
  defaultContent: string;
  multiline: boolean;
}

const PAGE_CARDS: PageCard[] = [
  {
    key: 'accueil',
    iconType: 'home',
    title: "Page d'Accueil",
    lastModified: 'Dernière modif: il y a 2h',
    badge: { label: 'Modifié', variant: 'gold' },
    label: 'Slogan principal',
    defaultContent: "Une nuit où le temps s'arrête, et la magie commence.",
    multiline: true,
  },
  {
    key: 'about',
    iconType: 'info',
    title: 'À Propos',
    lastModified: 'Dernière modif: 3 janv',
    badge: { label: 'Statique', variant: 'grey' },
    label: 'Description courte',
    defaultContent: "Fondé en 1992, le gala célèbre l'élégance et l'art de vivre à la française...",
    multiline: true,
  },
  {
    key: 'press',
    iconType: 'news',
    title: 'Espace Presse',
    lastModified: 'En attente de relecture',
    badge: null,
    label: 'Contact médias',
    defaultContent: 'presse@lamagiedusoir.fr',
    multiline: false,
  },
];


const MAX_DOC_BYTES = 4 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatModifiedNow(): string {
  const d = new Date();
  return `Modifié le ${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function detectDocType(file: File): 'pdf' | 'docx' | null {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  return null;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6z" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="20" aria-hidden="true">
      <path fill="#ef4444" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinejoin="round" />
      <text x="12" y="17" fontFamily="sans-serif" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#fff">PDF</text>
    </svg>
  );
}
function DocxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="20" aria-hidden="true">
      <path fill="#3b82f6" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinejoin="round" />
      <text x="12" y="17" fontFamily="sans-serif" fontSize="4.5" fontWeight="bold" textAnchor="middle" fill="#fff">DOCX</text>
    </svg>
  );
}

function PageIcon({ type }: { type: 'home' | 'info' | 'news' }) {
  if (type === 'home') return <HomeIcon />;
  if (type === 'info') return <InfoIcon />;
  return <NewsIcon />;
}

export default function Cms() {
  const {
    slogan, setSlogan,
    aboutDescription, setAboutDescription,
    medias, addMedia, removeMedia,
    documents, addDocument, removeDocument,
  } = useCms();
  const [pressEmail, setPressEmail] = useState(PAGE_CARDS[2].defaultContent);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);

  const values: Record<PageKey, string> = {
    accueil: slogan,
    about:   aboutDescription,
    press:   pressEmail,
  };
  const setters: Record<PageKey, (v: string) => void> = {
    accueil: setSlogan,
    about:   setAboutDescription,
    press:   setPressEmail,
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') addMedia(reader.result);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette image de la bibliothèque ?')) {
      removeMedia(id);
    }
  };

  const openDocPicker = () => docInputRef.current?.click();

  const handleDocsSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const type = detectDocType(file);
      if (!type) {
        window.alert(`Format non supporté : ${file.name}. Seuls les PDF et DOCX sont acceptés.`);
        return;
      }
      if (file.size > MAX_DOC_BYTES) {
        window.alert(`Fichier trop volumineux : ${file.name} (${formatFileSize(file.size)}). Maximum autorisé : 4 Mo.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        addDocument({
          name: file.name,
          size: formatFileSize(file.size),
          modified: formatModifiedNow(),
          type,
          dataUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    });
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleDocView = (doc: typeof documents[number]) => {
    if (!doc.dataUrl) {
      window.alert('Ce document est un exemple de démonstration. Importez un fichier pour pouvoir le consulter.');
      return;
    }
    window.open(doc.dataUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDocDelete = (id: string) => {
    if (window.confirm('Supprimer ce document ?')) {
      removeDocument(id);
    }
  };

  return (
    <AdminLayout topBar searchPlaceholder="Rechercher un contenu..." footer={false}>
      <div className="cms-seal" aria-hidden="true">
        <img src="/images/cms-seal-decorative.svg" alt="" />
      </div>

      {/* ─── HERO SPOTLIGHT ─── */}
      <section className="cms-hero">
        <img src="/images/cms-hero-bg.png" alt="" className="cms-hero__bg" />
        <div className="cms-hero__gradient" aria-hidden="true" />
        <div className="cms-hero__content">
          <span className="cms-hero__badge">Éditeur de site</span>
          <h1 className="cms-hero__title">Gestion du Contenu CMS</h1>
          <p className="cms-hero__subtitle">
            Modelez l'expérience visuelle et textuelle du Gala 2026.
          </p>
        </div>
      </section>

      {/* ─── PAGES PRINCIPALES ─── */}
      <section className="cms-pages">
        <header className="cms-section__header">
          <h2 className="cms-section__title">Pages Principales</h2>
          <div className="cms-section__actions">
            <button type="button" className="cms-btn cms-btn--secondary">
              Aperçu en direct
            </button>
            <button type="button" className="cms-btn cms-btn--primary">
              Publier les modifications
            </button>
          </div>
        </header>

        <div className="cms-pages__grid">
          {PAGE_CARDS.map(card => (
            <article key={card.key} className="cms-page-card">
              <div className="cms-page-card__head">
                <span className="cms-page-card__icon">
                  <PageIcon type={card.iconType} />
                </span>
                {card.badge && (
                  <span className={`cms-page-card__badge cms-page-card__badge--${card.badge.variant}`}>
                    {card.badge.label}
                  </span>
                )}
              </div>
              <div className="cms-page-card__info">
                <h3>{card.title}</h3>
                <span className="cms-page-card__modified">{card.lastModified}</span>
              </div>
              <div className="cms-page-card__field">
                <label>{card.label}</label>
                {card.multiline ? (
                  <textarea
                    value={values[card.key]}
                    onChange={e => setters[card.key](e.target.value)}
                    rows={3}
                  />
                ) : (
                  <input
                    type="text"
                    value={values[card.key]}
                    onChange={e => setters[card.key](e.target.value)}
                  />
                )}
              </div>
              <button type="button" className="cms-page-card__btn">
                Éditer les sections
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ─── BIBLIOTHÈQUE DE MÉDIAS ─── */}
      <section className="cms-media">
        <header className="cms-media__header">
          <h2 className="cms-section__title">Bibliothèque de Médias</h2>
          <button
            type="button"
            className="cms-btn cms-btn--import"
            onClick={openFilePicker}
          >
            <PlusIcon />
            <span>Importer images</span>
          </button>
        </header>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        <div className="cms-media__grid">
          {medias.map((m) => (
            <figure
              key={m.id}
              className="cms-media__item"
            >
              <img src={m.src} alt="" />
              {m.tag && <span className="cms-media__tag">{m.tag}</span>}
              <div className="cms-media__overlay">
                <button
                  type="button"
                  className="cms-media__action"
                  aria-label="Voir"
                  onClick={() => setLightboxSrc(m.src)}
                >
                  <EyeIcon />
                </button>
                <button
                  type="button"
                  className="cms-media__action cms-media__action--danger"
                  aria-label="Supprimer"
                  onClick={() => handleDelete(m.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </figure>
          ))}

          <button
            type="button"
            className="cms-media__dropzone"
            onClick={openFilePicker}
          >
            <UploadIcon />
            <span>Ajouter au press kit</span>
          </button>
        </div>
      </section>

      {lightboxSrc && (
        <div
          className="cms-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            className="cms-lightbox__close"
            aria-label="Fermer"
            onClick={() => setLightboxSrc(null)}
          >
            ×
          </button>
          <img
            src={lightboxSrc}
            alt=""
            className="cms-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ─── DOCUMENTS & PRESS KIT ─── */}
      <section className="cms-docs">
        <header className="cms-docs__header">
          <span className="cms-docs__icon"><BriefcaseIcon /></span>
          <div>
            <h3 className="cms-docs__title">Documents &amp; Press Kit</h3>
            <p className="cms-docs__subtitle">
              Gérez les fichiers téléchargeables pour les médias et partenaires.
            </p>
          </div>
        </header>

        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          hidden
          onChange={(e) => handleDocsSelected(e.target.files)}
        />

        <div className="cms-docs__list">
          {documents.map(doc => (
            <article key={doc.id} className="cms-doc">
              <div className="cms-doc__info">
                {doc.type === 'pdf' ? <PdfIcon /> : <DocxIcon />}
                <div>
                  <span className="cms-doc__name">{doc.name}</span>
                  <span className="cms-doc__meta">
                    {doc.size} • {doc.modified}
                  </span>
                </div>
              </div>
              <div className="cms-doc__actions">
                <button
                  type="button"
                  aria-label="Voir"
                  onClick={() => handleDocView(doc)}
                >
                  <EyeIcon />
                </button>
                <button
                  type="button"
                  aria-label="Supprimer"
                  onClick={() => handleDocDelete(doc.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </article>
          ))}

          <button
            type="button"
            className="cms-docs__dropzone"
            onClick={openDocPicker}
          >
            <UploadIcon />
            <span>Déposer un nouveau document</span>
          </button>
        </div>
      </section>
    </AdminLayout>
  );
}
