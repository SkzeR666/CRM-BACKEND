export default function GlobalLoading() {
  return (
    <div className="samfer-app">
      <div className="samfer-shell">
        <div className="samfer-header" />
        <main className="samfer-main">
          <section className="samfer-hero">
            <div className="samfer-skeleton samfer-gallery-main" />
          </section>

          <section className="samfer-section">
            <div className="samfer-skeleton" style={{ minHeight: 56 }} />
            <div className="samfer-filter-grid">
              <div className="samfer-skeleton" style={{ minHeight: 80 }} />
              <div className="samfer-skeleton" style={{ minHeight: 80 }} />
              <div className="samfer-skeleton" style={{ minHeight: 80 }} />
            </div>
          </section>

          <section className="samfer-card-grid">
            <article className="samfer-skeleton-card" />
            <article className="samfer-skeleton-card" />
          </section>
        </main>
      </div>
    </div>
  );
}
