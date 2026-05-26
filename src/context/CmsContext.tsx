import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'lmds.cms';
const LEGACY_SLOGAN = "Une nuit où le temps s'arrête, et la magie commence.";
const LEGACY_ABOUT = "Fondé en 1992, le gala célèbre l'élégance et l'art de vivre à la française...";

export interface CmsMedia {
  id: string;
  src: string;
  tag?: string | null;
}

export type CmsDocType = 'pdf' | 'docx';

export interface CmsDocument {
  id: string;
  name: string;
  size: string;
  modified: string;
  type: CmsDocType;
  dataUrl?: string;
}

const DEFAULT_MEDIAS: CmsMedia[] = [
  { id: 'seed-1', src: '/images/cms-media-1.png', tag: 'BANNER_MAIN' },
  { id: 'seed-2', src: '/images/cms-media-2.jpg', tag: null },
  { id: 'seed-3', src: '/images/cms-media-3.jpg', tag: null },
];

const DEFAULT_DOCUMENTS: CmsDocument[] = [
  { id: 'doc-seed-1', name: 'Dossier de Presse - Janvier 2026.pdf', size: '12.4 MB', modified: 'Modifié hier',      type: 'pdf'  },
  { id: 'doc-seed-2', name: 'Communiqué de Presse_Lancement.docx', size: '1.2 MB',  modified: 'Modifié le 12 déc', type: 'docx' },
];

const DEFAULTS = {
  slogan: "Une nuit où l'imaginaire africain sublime la scène mondiale.",
  aboutDescription:
    "Célébrer l'excellence, magnifier l'héritage et projeter l'Afrique vers les sommets de l'art mondial.",
  medias: DEFAULT_MEDIAS,
  documents: DEFAULT_DOCUMENTS,
};

type CmsContent = typeof DEFAULTS;

interface CmsContextValue extends CmsContent {
  setSlogan: (value: string) => void;
  setAboutDescription: (value: string) => void;
  addMedia: (src: string) => void;
  removeMedia: (id: string) => void;
  addDocument: (doc: Omit<CmsDocument, 'id'>) => void;
  removeDocument: (id: string) => void;
}

const CmsContext = createContext<CmsContextValue | null>(null);

function readStored(): CmsContent {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<CmsContent>;
    const merged = { ...DEFAULTS, ...parsed };
    if (merged.slogan === LEGACY_SLOGAN) merged.slogan = DEFAULTS.slogan;
    if (merged.aboutDescription === LEGACY_ABOUT) merged.aboutDescription = DEFAULTS.aboutDescription;
    return merged;
  } catch {
    return DEFAULTS;
  }
}

function makeId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(() => readStored());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // storage full or blocked — silently ignore, UI state still works
    }
  }, [content]);

  const value: CmsContextValue = {
    ...content,
    setSlogan: (slogan) => setContent((prev) => ({ ...prev, slogan })),
    setAboutDescription: (aboutDescription) =>
      setContent((prev) => ({ ...prev, aboutDescription })),
    addMedia: (src) =>
      setContent((prev) => ({
        ...prev,
        medias: [{ id: makeId(), src, tag: null }, ...prev.medias],
      })),
    removeMedia: (id) =>
      setContent((prev) => ({
        ...prev,
        medias: prev.medias.filter((m) => m.id !== id),
      })),
    addDocument: (doc) =>
      setContent((prev) => ({
        ...prev,
        documents: [{ id: makeId(), ...doc }, ...prev.documents],
      })),
    removeDocument: (id) =>
      setContent((prev) => ({
        ...prev,
        documents: prev.documents.filter((d) => d.id !== id),
      })),
  };

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within a CmsProvider');
  return ctx;
}
