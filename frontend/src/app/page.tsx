import { listProjects } from "@/lib/api/projects";

export default async function HomePage() {
  const { projects, error } = await listProjects({ limit: 6 });

  return (
    <main className="page-shell">
      <section className="stack">
        <span className="badge">Frontend base</span>
        <h1 className="title">Pronto para reconstruir a UI do novo Figma</h1>
        <p className="muted">
          Esta base mantem apenas estrutura, rotas principais, estilos globais e consumo da API oficial.
        </p>
      </section>

      <section className="card stack">
        <h2 className="section-title">Conexao com backend</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <p className="muted">
            API ativa. {projects.length} projeto(s) retornado(s) em
            <code> /api/projects</code>.
          </p>
        )}
      </section>
    </main>
  );
}
