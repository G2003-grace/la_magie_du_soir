import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import { useCandidats } from '../context/CandidatsContext';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: '',             label: 'Sélectionnez une catégorie' },
  { value: 'Chanteur',     label: 'Chanteur·se' },
  { value: 'Danseur',      label: 'Danseur·se' },
  { value: 'Musicien',     label: 'Musicien·ne' },
];

interface FormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  category: string;
  discipline: string;
  experience: string;
  photo: string;
  motivation: string;
  videoUrl: string;
  socialLinks: string;
  consentJury: boolean;
  consentPrivacy: boolean;
}

const INITIAL: FormState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  category: '',
  discipline: '',
  experience: '',
  photo: '',
  motivation: '',
  videoUrl: '',
  socialLinks: '',
  consentJury: false,
  consentPrivacy: false,
};

const MOTIVATION_MAX = 500;

export default function Candidater() {
  const { addCandidate } = useCandidats();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Merci de sélectionner une image.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      window.alert('Image trop volumineuse. Maximum 2 Mo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') update('photo', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.consentJury || !form.consentPrivacy) {
      window.alert('Merci d’accepter les deux conditions de consentement.');
      return;
    }

    setSubmitting(true);
    const created = addCandidate({
      avatar: form.photo || '/images/candidat-placeholder.jpg',
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      city: form.city.trim(),
      category: form.discipline.trim() || form.category,
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: form.country.trim() || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      discipline: form.discipline.trim() || undefined,
      experience: form.experience ? Number(form.experience) : undefined,
      motivation: form.motivation.trim() || undefined,
      videoUrl: form.videoUrl.trim() || undefined,
      socialLinks: form.socialLinks.trim() || undefined,
    });

    navigate('/candidater/confirmation', {
      state: {
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email ?? form.email,
      },
      replace: true,
    });
  };

  const motivationLeft = MOTIVATION_MAX - form.motivation.length;

  return (
    <>
      <TopNavBar />

      <main className="candidater">
        <section className="candidater__hero">
          <div className="candidater__hero-gradient" aria-hidden="true" />
          <div className="candidater__hero-content">
            <span className="candidater__badge">Casting 2026</span>
            <h1 className="candidater__title">Déposez votre candidature</h1>
            <p className="candidater__subtitle">
              Chanteurs, danseurs, musiciens — partagez votre talent avec le jury
              de La Magie du Soir.
            </p>
          </div>
        </section>

        <form className="candidater-form" onSubmit={onSubmit} noValidate>
          {/* ── IDENTITÉ ── */}
          <fieldset className="candidater-form__section">
            <legend className="candidater-form__legend">Identité</legend>

            <div className="candidater-form__row">
              <label className="candidater-form__field">
                <span>Prénom *</span>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                />
              </label>
              <label className="candidater-form__field">
                <span>Nom *</span>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                />
              </label>
            </div>

            <div className="candidater-form__row">
              <label className="candidater-form__field">
                <span>Date de naissance *</span>
                <input
                  type="date"
                  required
                  value={form.dateOfBirth}
                  onChange={(e) => update('dateOfBirth', e.target.value)}
                />
              </label>
              <label className="candidater-form__field">
                <span>Email *</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </label>
            </div>

            <div className="candidater-form__row">
              <label className="candidater-form__field">
                <span>Téléphone *</span>
                <input
                  type="tel"
                  required
                  placeholder="+33 6 XX XX XX XX"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </label>
              <label className="candidater-form__field">
                <span>Ville *</span>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                />
              </label>
              <label className="candidater-form__field">
                <span>Pays</span>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          {/* ── DISCIPLINE ── */}
          <fieldset className="candidater-form__section">
            <legend className="candidater-form__legend">Discipline</legend>

            <div className="candidater-form__row">
              <label className="candidater-form__field">
                <span>Catégorie *</span>
                <select
                  required
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} disabled={!c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="candidater-form__field">
                <span>Discipline précise *</span>
                <input
                  type="text"
                  required
                  placeholder="Ex. Violoniste Soliste, Jazz Vocals"
                  value={form.discipline}
                  onChange={(e) => update('discipline', e.target.value)}
                />
              </label>
              <label className="candidater-form__field">
                <span>Années d'expérience</span>
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={form.experience}
                  onChange={(e) => update('experience', e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          {/* ── DOSSIER ARTISTIQUE ── */}
          <fieldset className="candidater-form__section">
            <legend className="candidater-form__legend">Dossier artistique</legend>

            <div className="candidater-form__photo">
              <div className="candidater-form__photo-preview">
                {form.photo ? (
                  <img src={form.photo} alt="Aperçu photo de profil" />
                ) : (
                  <span>Aucune photo</span>
                )}
              </div>
              <div className="candidater-form__photo-actions">
                <button
                  type="button"
                  className="candidater-form__btn-secondary"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {form.photo ? 'Changer de photo' : 'Ajouter une photo'}
                </button>
                {form.photo && (
                  <button
                    type="button"
                    className="candidater-form__btn-link"
                    onClick={() => update('photo', '')}
                  >
                    Retirer
                  </button>
                )}
                <small>Format image • 2 Mo maximum</small>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handlePhoto(e.target.files?.[0])}
                />
              </div>
            </div>

            <label className="candidater-form__field candidater-form__field--full">
              <span>
                Motivation *{' '}
                <small className="candidater-form__counter">
                  ({motivationLeft} caractère{motivationLeft > 1 ? 's' : ''} restant
                  {motivationLeft > 1 ? 's' : ''})
                </small>
              </span>
              <textarea
                required
                rows={5}
                maxLength={MOTIVATION_MAX}
                placeholder="Pourquoi souhaitez-vous participer au gala ?"
                value={form.motivation}
                onChange={(e) => update('motivation', e.target.value)}
              />
            </label>

            <div className="candidater-form__row">
              <label className="candidater-form__field">
                <span>Lien vidéo de performance</span>
                <input
                  type="url"
                  placeholder="YouTube, Vimeo, SoundCloud…"
                  value={form.videoUrl}
                  onChange={(e) => update('videoUrl', e.target.value)}
                />
              </label>
              <label className="candidater-form__field">
                <span>Réseaux sociaux / site</span>
                <input
                  type="text"
                  placeholder="Instagram, site perso…"
                  value={form.socialLinks}
                  onChange={(e) => update('socialLinks', e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          {/* ── CONSENTEMENT ── */}
          <fieldset className="candidater-form__section">
            <legend className="candidater-form__legend">Consentement</legend>

            <label className="candidater-form__check">
              <input
                type="checkbox"
                required
                checked={form.consentJury}
                onChange={(e) => update('consentJury', e.target.checked)}
              />
              <span>J'accepte que ma candidature soit évaluée par le jury.</span>
            </label>

            <label className="candidater-form__check">
              <input
                type="checkbox"
                required
                checked={form.consentPrivacy}
                onChange={(e) => update('consentPrivacy', e.target.checked)}
              />
              <span>
                J'accepte la{' '}
                <a href="/confidentialite" target="_blank" rel="noopener noreferrer">
                  politique de confidentialité
                </a>
                .
              </span>
            </label>
          </fieldset>

          <div className="candidater-form__actions">
            <button
              type="submit"
              className="candidater-form__submit"
              disabled={submitting}
            >
              {submitting ? 'Envoi en cours…' : 'Envoyer ma candidature'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}
