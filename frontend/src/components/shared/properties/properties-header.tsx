import { PageHeader } from "@/components/ui/page-header";

export function PropertiesHeader() {
  return (
    <PageHeader
      title="Property List"
      description="Lista conectada ao endpoint /api/projects com filtro por cidade e status."
    />
  );
}