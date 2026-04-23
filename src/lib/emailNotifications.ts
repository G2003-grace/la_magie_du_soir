import type { Candidate, CandidateStatus } from '../context/CandidatsContext';

export const EMAIL_SUBJECT = 'La Magie du Soir — Suite de votre candidature';

const SIGNATURE = '\n\nL\'équipe de La Magie du Soir';

const TEMPLATES: Partial<Record<CandidateStatus, string>> = {
  'pre-selected':
    'Bonjour {firstName},\n\nBonne nouvelle ! Votre candidature a retenu notre attention. Nous revenons vers vous prochainement pour la suite du processus.' + SIGNATURE,
  'selected':
    'Bonjour {firstName},\n\nFélicitations ! Nous sommes ravis de vous compter parmi les candidats retenus pour l\'édition 2026 du gala La Magie du Soir.' + SIGNATURE,
  'rejected':
    'Bonjour {firstName},\n\nNous sommes vraiment désolés, vous n\'êtes pas retenu pour cette édition. Nous serons ravis de vous compter parmi les candidats de l\'édition prochaine.' + SIGNATURE,
};

export const STATUS_LABELS_FOR_EMAIL: Record<CandidateStatus, string> = {
  'pending':      'En attente',
  'pre-selected': 'Pré-sélectionné',
  'selected':     'Sélectionné',
  'interview':    'Entretien prévu',
  'rejected':     'Rejeté',
};

export interface StatusEmail {
  to: string;
  subject: string;
  body: string;
  status: CandidateStatus;
}

export function buildStatusEmail(candidate: Candidate, status: CandidateStatus): StatusEmail | null {
  const template = TEMPLATES[status];
  if (!template || !candidate.email) return null;
  return {
    to: candidate.email,
    subject: EMAIL_SUBJECT,
    body: template.replace('{firstName}', candidate.firstName),
    status,
  };
}

/**
 * Stub d'envoi. Quand EmailJS sera configuré, remplacer le corps par
 *   emailjs.send(SERVICE_ID, TEMPLATE_ID, { to: email.to, subject: ..., message: ... }, PUBLIC_KEY)
 * Pour l'instant : simple log console pour tracer ce qui aurait été envoyé.
 */
export async function sendStatusEmail(email: StatusEmail): Promise<void> {
  // TODO: brancher EmailJS ici
  // eslint-disable-next-line no-console
  console.info('[email stub]', email);
  await new Promise((resolve) => setTimeout(resolve, 120));
}
