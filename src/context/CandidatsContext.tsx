import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'lmds.candidats';

export type CandidateStatus =
  | 'pending'
  | 'pre-selected'
  | 'selected'
  | 'interview'
  | 'rejected';

export interface Candidate {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  city: string;
  category: string;
  date: string;
  status: CandidateStatus;
  stars: number | null;
  // Public registration fields (optional for legacy seeds)
  email?: string;
  phone?: string;
  country?: string;
  dateOfBirth?: string;
  discipline?: string;
  experience?: number;
  motivation?: string;
  videoUrl?: string;
  socialLinks?: string;
}

const DEFAULT_CANDIDATES: Candidate[] = [
  { id: 'elena-valery',  avatar: '/images/candidat-elena.jpg',  firstName: 'Elena',  lastName: 'Valery',  city: 'Paris, FR',  category: 'Chanteuse Lyrique',    date: '12 octobre 2025', status: 'pre-selected', stars: 4 },
  { id: 'julian-morel',  avatar: '/images/candidat-julian.jpg', firstName: 'Julian', lastName: 'Morel',   city: 'Lyon, FR',   category: 'Danseur Contemporain', date: '14 octobre 2025', status: 'pending',      stars: null },
  { id: 'thomas-berg',   avatar: '/images/candidat-thomas.jpg', firstName: 'Thomas', lastName: 'Berg',    city: 'Berlin, DE', category: 'Violoniste Soliste',   date: '15 octobre 2025', status: 'interview',    stars: 5 },
  { id: 'sarah-jenkins', avatar: '/images/candidat-sarah.jpg',  firstName: 'Sarah',  lastName: 'Jenkins', city: 'London, UK', category: 'Jazz Vocals',          date: '18 octobre 2025', status: 'rejected',     stars: 2 },
];

interface CandidatsContextValue {
  candidates: Candidate[];
  updateStatus: (id: string, status: CandidateStatus) => void;
  addCandidate: (input: Omit<Candidate, 'id' | 'status' | 'stars' | 'date'>) => Candidate;
}

const CandidatsContext = createContext<CandidatsContextValue | null>(null);

function readStored(): Candidate[] {
  if (typeof window === 'undefined') return DEFAULT_CANDIDATES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CANDIDATES;
    const parsed = JSON.parse(raw) as Candidate[];
    if (!Array.isArray(parsed)) return DEFAULT_CANDIDATES;
    return parsed;
  } catch {
    return DEFAULT_CANDIDATES;
  }
}

export function CandidatsProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>(() => readStored());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    } catch {
      // storage quota — silently ignore
    }
  }, [candidates]);

  const value: CandidatsContextValue = {
    candidates,
    updateStatus: (id, status) =>
      setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c))),
    addCandidate: (input) => {
      const created: Candidate = {
        id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        status: 'pending',
        stars: null,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        ...input,
      };
      setCandidates((prev) => [created, ...prev]);
      return created;
    },
  };

  return <CandidatsContext.Provider value={value}>{children}</CandidatsContext.Provider>;
}

export function useCandidats(): CandidatsContextValue {
  const ctx = useContext(CandidatsContext);
  if (!ctx) throw new Error('useCandidats must be used within a CandidatsProvider');
  return ctx;
}
