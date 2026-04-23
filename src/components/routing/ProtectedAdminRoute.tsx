import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: Props) {
  const isAuthed = typeof window !== 'undefined'
    && window.localStorage.getItem('admin-token') === '1';

  if (!isAuthed) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
