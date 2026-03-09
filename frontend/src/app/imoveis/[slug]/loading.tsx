export default function PropertyDetailsLoading() {
  return (
    <div className="samfer-app">
      <div className="samfer-shell">
        <div className="samfer-header" />
        <main className="samfer-main">
          <section className="samfer-gallery-hero">
            <div className="samfer-skeleton samfer-gallery-main" />
            <div className="samfer-gallery-grid">
              <div className="samfer-skeleton samfer-gallery-thumb" />
              <div className="samfer-skeleton samfer-gallery-thumb" />
              <div className="samfer-skeleton samfer-gallery-thumb" />
            </div>
          </section>

          <section className="samfer-detail-top">
            <article className="samfer-detail-summary samfer-skeleton-card" />
            <aside className="samfer-detail-cta samfer-skeleton-card" />
          </section>

          <section className="samfer-floor-grid">
            <article className="samfer-floor-card samfer-skeleton-card" />
            <article className="samfer-floor-card samfer-skeleton-card" />
            <article className="samfer-floor-card samfer-skeleton-card" />
          </section>
        </main>
      </div>
    </div>
  );
}
