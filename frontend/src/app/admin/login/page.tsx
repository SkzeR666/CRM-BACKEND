import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-base px-4 py-10 text-primary">
      <div className="mx-auto max-w-md pt-20">
        <div className="rounded-[10px] border border-subtle bg-surface p-6 md:p-8">
          <div className="mb-6">
            <h1 className="heading-lg text-primary">Login admin</h1>
            <p className="body-sm text-secondary mt-2">
              Acesse a área administrativa para cadastrar e editar imóveis.
            </p>
          </div>

          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}