import { NewProjectForm } from "@/components/admin/new-project-form";

export default function AdminNewPropertyPage() {
  return (
    <main className="page-shell">
      <section className="card stack">
        <h1 className="title">Novo projeto</h1>
        <p className="muted">
          Formulario minimo para validar o fluxo Front → Back/API → Supabase.
        </p>
        <NewProjectForm />
      </section>
    </main>
  );
}
