import { AdminHeader } from "@/components/shared/admin-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { FormSection } from "@/components/shared/form-section";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AdminLoginFormLocal } from "./admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main>
        <Section>
          <Container className="max-w-[720px]">
            <FormSection
              title="Admin Login"
              description="Salve a chave no navegador para habilitar criacao de projetos."
            >
              <AdminLoginFormLocal />
            </FormSection>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}