import Link from "next/link";
import { Bath, BedDouble, CarFront } from "lucide-react";
import { formatPrice } from "@/lib/utils/format-price";
import type { Project } from "@/types/project";
import type { SamferTheme } from "@/lib/utils/theme";
import { getFallbackCover } from "./content";

type Props = {
  project: Project;
  theme: SamferTheme;
  index?: number;
};

export function PropertyCard({ project, theme, index = 0 }: Props) {
  const price = typeof project.price === "number" ? formatPrice(project.price) : "Sob consulta";

  return (
    <article className="samfer-property-card samfer-animate">
      <img src={getFallbackCover(project, index)} alt={project.title} className="samfer-property-cover" />
      <div className="samfer-property-content">
        <h3>{project.title}</h3>
        <p>{project.description || "Empreendimento pensado para conforto, praticidade e qualidade de vida."}</p>
        <div className="samfer-pills">
          <span>
            <BedDouble size={13} /> {project.bedrooms ?? 2} dormitórios
          </span>
          <span>
            <Bath size={13} /> {project.bathrooms ?? 1} banheiro
          </span>
          <span>
            <CarFront size={13} /> {project.parking_spots ?? 1} vaga
          </span>
        </div>
        <div className="samfer-property-bottom">
          <div>
            <small>A partir de</small>
            <strong>{price}</strong>
          </div>
          <Link href={`/imoveis/${project.slug}?theme=${theme}`} className="samfer-property-link">
            Ver detalhes do imóvel
          </Link>
        </div>
      </div>
    </article>
  );
}

