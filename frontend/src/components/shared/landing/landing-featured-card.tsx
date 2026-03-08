import Link from "next/link";
import { Bath, BedDouble, CarFront } from "lucide-react";
import type { Project } from "@/types/project";
import { formatPrice } from "@/lib/utils/format-price";

type LandingFeaturedCardProps = {
  project: Project;
};

const fallbackImage = "/images/hero-property.jpg";

export function LandingFeaturedCard({ project }: LandingFeaturedCardProps) {
  const image = project.cover_image || project.gallery?.[0] || fallbackImage;

  return (
    <article className="space-y-[30px] rounded-[10px] border border-border bg-surface-alt p-6 md:p-[40px]">
      <div className="overflow-hidden rounded-[5px]">
        {/* AJUSTE: altura do cover */}
        <img src={image} alt={project.title} className="h-[280px] w-full object-cover md:h-[460px]" />
      </div>

      <div className="space-y-[30px]">
        <div className="space-y-[6px]">
          <h3 className="text-2xl font-bold tracking-[-0.28px] text-foreground md:text-[28px]">{project.title}</h3>
          <p className="text-sm leading-6 text-foreground-secondary md:text-[16px]">
            {project.description ||
              "Um empreendimento pensado para quem busca conforto, praticidade e qualidade de vida em uma excelente localizacao."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[10px]">
          <span className="inline-flex items-center gap-2 rounded-[5px] bg-surface px-[14px] py-3 text-xs font-medium tracking-[0.12px] text-foreground-secondary">
            <BedDouble size={15} />
            {project.bedrooms ?? 2} dormitorios
          </span>
          <span className="inline-flex items-center gap-2 rounded-[5px] bg-surface px-[14px] py-3 text-xs font-medium tracking-[0.12px] text-foreground-secondary">
            <Bath size={15} />
            {project.bathrooms ?? 1} banheiro
          </span>
          <span className="inline-flex items-center gap-2 rounded-[5px] bg-surface px-[14px] py-3 text-xs font-medium tracking-[0.12px] text-foreground-secondary">
            <CarFront size={15} />
            Vaga de garagem
          </span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-[50px]">
          <div className="space-y-0.5 md:min-w-[173px]">
            <p className="text-xs text-foreground-secondary">A partir de</p>
            {/* AJUSTE: tamanho do preco */}
            <p className="text-[30px] font-bold tracking-[-0.34px] text-foreground md:text-[34px]">{formatPrice(project.price)}</p>
          </div>

          <Link
            href={`/imoveis/${project.slug}`}
            className="inline-flex h-[56px] min-w-[220px] items-center justify-center rounded-[5px] bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Ver detalhes do imovel
          </Link>
        </div>
      </div>
    </article>
  );
}