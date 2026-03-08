import { AdminHeader } from "@/components/shared/admin-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { FormSection } from "@/components/shared/form-section";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PropertyFormLocal } from "./property-form";

export default function AdminNewPropertyPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main>
        <Section>
          <Container className="max-w-[720px]">
            <FormSection
              title="Admin Property Form"
              description="Cadastro minimo para criar um novo imovel no backend."
            >
              <PropertyFormLocal />
            </FormSection>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}