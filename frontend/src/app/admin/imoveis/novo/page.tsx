import { PropertyForm } from "@/app/admin/property-form";

export default function AdminNewPropertyPage() {
  return (
    <main className="min-h-screen bg-base px-4 py-10 text-primary">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="heading-lg text-primary">Novo imóvel</h1>
          <p className="body-sm text-secondary mt-2">
            Cadastre um novo imóvel para aparecer na vitrine e nos filtros.
          </p>
        </div>

        <div className="rounded-[10px] border border-subtle bg-surface p-6 md:p-8">
          <PropertyForm />
        </div>
      </div>
    </main>
  );
}