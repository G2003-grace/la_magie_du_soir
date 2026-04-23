import type { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import AdminTopBar from './AdminTopBar';

interface AdminLabel {
  name: string;
  subtitle: string;
  avatar?: string;
}

interface Props {
  children: ReactNode;
  topBar?: boolean;
  searchPlaceholder?: string;
  showSearch?: boolean;
  adminLabel?: AdminLabel;
  footer?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function AdminLayout({
  children,
  topBar = false,
  searchPlaceholder,
  showSearch,
  adminLabel,
  footer = true,
  searchValue,
  onSearchChange,
}: Props) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__content">
        {topBar && (
          <AdminTopBar
            searchPlaceholder={searchPlaceholder}
            showSearch={showSearch}
            adminLabel={adminLabel}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
          />
        )}
        <main className="admin-layout__main">{children}</main>
        {footer && <AdminFooter />}
      </div>
    </div>
  );
}
