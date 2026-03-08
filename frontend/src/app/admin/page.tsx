import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="page-shell">
      <section className="card stack">
        <h1 className="title">Area administrativa</h1>
        <p className="muted">
          O backend protege rotas administrativas e executa toda regra de negocio.
        </p>
        <div className="actions">
          <Link className="button" href="/admin/login">
            Configurar chave local
          </Link>
          <Link className="button button-secondary" href="/admin/imoveis/novo">
            Criar projeto
          </Link>
        </div>
      </section>
    </main>
  );
}
