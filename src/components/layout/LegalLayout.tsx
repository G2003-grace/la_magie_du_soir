import type { ReactNode } from 'react';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

interface Props {
  kicker: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalLayout({ kicker, title, lastUpdated, children }: Props) {
  return (
    <>
      <TopNavBar />

      <main className="legal">
        <header className="legal__header">
          <span className="legal__kicker">{kicker}</span>
          <h1 className="legal__title">{title}</h1>
          <span className="legal__updated">Mis à jour le {lastUpdated}</span>
          <div className="legal__divider" />
        </header>

        <article className="legal__body">{children}</article>
      </main>

      <Footer />
    </>
  );
}
