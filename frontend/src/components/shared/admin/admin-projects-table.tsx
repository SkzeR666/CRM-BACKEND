import Link from "next/link";
import type { Project } from "@/types/project";
import { Table } from "@/components/ui/table";

type AdminProjectsTableProps = {
  projects: Project[];
  error?: string;
};

export function AdminProjectsTable({ projects, error }: AdminProjectsTableProps) {
  if (error) {
    return (
      <p className="rounded-[10px] border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-500">{error}</p>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="rounded-[10px] border border-border bg-surface p-5 text-sm text-muted-foreground">
        Nenhum projeto cadastrado no backend.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-border">
      <Table>
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-secondary">Titulo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-secondary">Cidade</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-secondary">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-secondary">Acao</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-border bg-background last:border-none">
              <td className="px-4 py-3 text-sm text-foreground">{project.title}</td>
              <td className="px-4 py-3 text-sm text-foreground-secondary">{project.city || "-"}</td>
              <td className="px-4 py-3 text-sm text-foreground-secondary">{project.status || "-"}</td>
              <td className="px-4 py-3 text-sm">
                <Link href={`/imoveis/${project.slug}`} className="text-primary transition hover:text-primary-hover">
                  Abrir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}