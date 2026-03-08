import type { Project } from "@/types/project";
import { PropertyCard } from "@/components/shared/property-card";

type PropertiesGridProps = {
  projects: Project[];
  error?: string;
};

export function PropertiesGrid({ projects, error }: PropertiesGridProps) {
  if (error) {
    return (
      <p className="rounded-[10px] border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-500">{error}</p>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="rounded-[10px] border border-border bg-surface p-5 text-sm text-muted-foreground">
        Nenhum imovel encontrado para os filtros selecionados.
      </p>
    );
  }

  return (
    /* AJUSTE: espacamento entre cards */
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <PropertyCard key={project.id} project={project} />
      ))}
    </div>
  );
}