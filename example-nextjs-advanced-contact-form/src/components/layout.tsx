// src/components/Layout.tsx
import styles from './layout.module.css';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <>
      <Header /> {/* Fixed Navbar */}
      <div className={styles.layout}>
        <main className={styles.main}>
          {children} {/* Main content */}
        </main>
        <aside className={styles.aside}>
          <div className={styles.header}>
            <h2 className={styles.title}>Need some help?</h2>
          </div>
          <div className={styles.asideContent}>
            {/* Sidebar or additional content */}
          </div>
        </aside>
      </div>
    </>
  );
}
