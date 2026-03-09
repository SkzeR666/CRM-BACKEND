import Link from "next/link";
import Image from "next/image";
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
  const href = `/imoveis/${project.slug}?theme=${theme}`;

  return (
    <article className="samfer-property-card samfer-animate">
      <Link href={href} className="samfer-card-link" aria-label={`Ver detalhes de ${project.title}`}>
        <Image
          src={getFallbackCover(project, index)}
          alt={project.title}
          className="samfer-property-cover"
          width={900}
          height={600}
          sizes="(max-width: 860px) 100vw, 50vw"
        />
        <div className="samfer-property-content">
          <h3>{project.title}</h3>
          {project.description ? <p>{project.description}</p> : null}
          <div className="samfer-pills">
            {typeof project.bedrooms === "number" && project.bedrooms > 0 ? (
              <span>
                <BedDouble size={13} /> {project.bedrooms} dormitorios
              </span>
            ) : null}
            {typeof project.bathrooms === "number" && project.bathrooms > 0 ? (
              <span>
                <Bath size={13} /> {project.bathrooms} banheiro{project.bathrooms > 1 ? "s" : ""}
              </span>
            ) : null}
            {typeof project.parking_spots === "number" && project.parking_spots > 0 ? (
              <span>
                <CarFront size={13} /> {project.parking_spots} vaga{project.parking_spots > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
          <div className="samfer-property-bottom">
            <div>
              <small>A partir de</small>
              <strong>{price}</strong>
            </div>
            <span className="samfer-property-link">Ver detalhes do imovel</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
