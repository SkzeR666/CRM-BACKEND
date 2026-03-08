import Link from "next/link";
import { Bath, BedDouble, CarFront, MapPin } from "lucide-react";
import type { Project } from "@/types/project";
import { formatPrice } from "@/lib/utils/format-price";

const fallbackImage = "/images/hero-property.jpg";

function getStatusLabel(status?: string | null) {
  if (status === "available") return "Disponivel";
  if (status === "reserved") return "Reservado";
  if (status === "sold") return "Vendido";
  return "Sem status";
}

type PropertyCardProps = {
  project: Project;
};

export function PropertyCard({ project }: PropertyCardProps) {
  const image = project.cover_image || project.gallery?.[0] || fallbackImage;

  return (
    <article className="overflow-hidden rounded-[10px] border border-border bg-surface">
      <img src={image} alt={project.title} className="h-56 w-full object-cover" />

      {/* AJUSTE: espacamento interno do card */}
      <div className="space-y-4 p-4 md:p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
          <p className="line-clamp-2 text-sm text-foreground-secondary">
            {project.description || "Sem descricao cadastrada."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-secondary">
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
            <MapPin size={14} />
            {project.city || "Cidade nao informada"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
            {getStatusLabel(project.status)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-foreground-secondary">
          <span className="inline-flex items-center gap-1">
            <BedDouble size={14} />
            {project.bedrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={14} />
            {project.bathrooms ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <CarFront size={14} />
            {project.parking_spots ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Preco</p>
            {/* AJUSTE: tamanho do preco */}
            <strong className="text-lg font-semibold tracking-tight">{formatPrice(project.price)}</strong>
          </div>
          <Link
            href={`/imoveis/${project.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}