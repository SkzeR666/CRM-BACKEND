import { listProjects } from "@/lib/api/projects";
import { AdminHeader } from "@/components/shared/admin-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { AdminPropertiesHeader } from "@/components/shared/admin/admin-properties-header";
import { AdminProjectsTable } from "@/components/shared/admin/admin-projects-table";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default async function AdminPropertiesPage() {
  const { projects, error } = await listProjects({ limit: 50 });

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main>
        <Section>
          <Container className="space-y-5">
            <AdminPropertiesHeader />
            <AdminProjectsTable projects={projects} error={error} />
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}