import { useState } from 'react';

interface AdminLabel {
  name: string;
  subtitle: string;
  avatar?: string;
}

interface Props {
  searchPlaceholder?: string;
  showSearch?: boolean;
  adminLabel?: AdminLabel;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function AdminTopBar({
  searchPlaceholder = 'Rechercher...',
  showSearch = true,
  adminLabel,
  searchValue,
  onSearchChange,
}: Props) {
  const [internalSearch, setInternalSearch] = useState('');
  const isControlled = onSearchChange !== undefined;
  const search = isControlled ? (searchValue ?? '') : internalSearch;
  const setSearch = (value: string) => {
    if (isControlled) onSearchChange(value);
    else setInternalSearch(value);
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <span className="admin-topbar__brand">La Magie du Soir 2026</span>
        {showSearch && (
          <div className="admin-topbar__search">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="admin-topbar__search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="admin-topbar__search-input"
            />
          </div>
        )}
      </div>

      <div className="admin-topbar__actions">
        <button type="button" className="admin-topbar__icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <button type="button" className="admin-topbar__icon-btn" aria-label="Paramètres">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {adminLabel ? (
          <div className="admin-topbar__profile admin-topbar__profile--rich">
            <div className="admin-topbar__profile-text">
              <span className="admin-topbar__profile-name">{adminLabel.name}</span>
              <span className="admin-topbar__profile-role">{adminLabel.subtitle}</span>
            </div>
            <img src={adminLabel.avatar ?? '/images/admin-topbar-avatar-v2.jpg'} alt="" />
          </div>
        ) : (
          <div className="admin-topbar__profile">
            <img src="/images/admin-topbar-avatar-v2.jpg" alt="" />
            <span>Admin</span>
          </div>
        )}
      </div>
    </header>
  );
}
