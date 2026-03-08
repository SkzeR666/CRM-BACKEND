import { MapPin } from "lucide-react";
import type { Project } from "@/types/project";
import { formatPrice } from "@/lib/utils/format-price";
import { Card } from "@/components/ui/card";

function getStatusLabel(status?: string | null) {
  if (status === "available") return "Disponivel";
  if (status === "reserved") return "Reservado";
  if (status === "sold") return "Vendido";
  return "Sem status";
}

type PropertySummaryProps = {
  project: Project;
};

export function PropertySummary({ project }: PropertySummaryProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        {/* AJUSTE: tamanho do titulo */}
        <h1 className="text-2xl font-semibold tracking-tight md:text-[34px]">{project.title}</h1>
        <p className="text-sm text-foreground-secondary md:text-base">
          {project.description || "Descricao nao informada."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-foreground-secondary">
          <MapPin size={14} />
          {project.city || "Cidade nao informada"}
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-foreground-secondary">
          {getStatusLabel(project.status)}
        </span>
        <span className="rounded-full border border-border px-3 py-1 text-foreground-secondary">
          {formatPrice(project.price)}
        </span>
      </div>
    </Card>
  );
}