import { notFound } from "next/navigation";
import { listProjects, getProjectBySlug } from "@/lib/api/projects";
import { formatPrice } from "@/lib/utils/format-price";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";
import { differentials, getFallbackCover, samferImages } from "@/components/samfer/content";

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export default async function PropertyBySlugPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const theme = resolveTheme(resolvedSearchParams.theme);

  const project = await getProjectBySlug(resolvedParams.slug);
  if (!project) notFound();

  const relatedResult = await listProjects({ city: project.city ?? undefined, limit: 4 });
  const related = relatedResult.projects.filter((item) => item.slug !== project.slug).slice(0, 2);

  const gallery = [project.cover_image, ...(project.gallery ?? [])].filter(Boolean) as string[];
  const mainImage = gallery[0] ?? getFallbackCover(project, 0);
  const sideImages = [
    gallery[1] ?? samferImages.galleryA,
    gallery[2] ?? samferImages.galleryB,
    gallery[3] ?? samferImages.galleryC,
  ];

  const price = typeof project.price === "number" ? formatPrice(project.price) : "Sob consulta";

  return (
    <div className={`samfer-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="samfer-shell">
        <SamferHeader theme={theme} title={project.title} backHref="/imoveis" />

        <main className="samfer-main">
          <section className="samfer-gallery-hero samfer-animate">
            <img src={mainImage} alt={project.title} className="samfer-gallery-main" />
            <div className="samfer-gallery-grid">
              {sideImages.map((image, index) => (
                <div key={image} className={`samfer-gallery-thumb ${index === 2 ? "is-overlay" : ""}`}>
                  <img src={image} alt={`${project.title} ${index + 2}`} />
                  {index === 2 ? <span>+ 12 Imagens</span> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="samfer-detail-top">
            <article className="samfer-detail-summary samfer-animate">
              <h1>{project.type || "Apartamentos"} | {project.neighborhood || "Jardim Santa Tereza"}</h1>
              <h2>{project.title}</h2>
              <p>{project.city || "Taubaté"} - {project.state || "São Paulo"}</p>
              <hr />
              <p className="samfer-text-strong">Conheça seu novo apartamento!</p>
              <p>
                {project.description ||
                  "More bem e viva ainda melhor em apartamentos com opções de varanda e área privativa."}
              </p>
              <ul>
                <li>{project.bedrooms ?? 2} dormitórios</li>
                <li>opções com varanda</li>
                <li>área de lazer completa</li>
                <li>localização estratégica</li>
                <li>Minha Casa Minha Vida</li>
              </ul>
            </article>

            <aside className="samfer-detail-cta samfer-animate">
              <h3>Fale com um especialista</h3>
              <p>tire dúvidas e veja condições do imóvel</p>
              <img src={samferImages.map} alt="Mapa da localização" />
              <div className="samfer-detail-cta-actions">
                <button type="button" className="samfer-primary-btn">
                  Falar com especialista
                </button>
                <button type="button" className="samfer-secondary-btn">
                  Ver plantas
                </button>
              </div>
            </aside>
          </section>

          <section className="samfer-section">
            <SectionTitle before="Plantas " highlight="disponíveis" />
            <div className="samfer-floor-grid">
              {["Planta Tipo A", "Planta Tipo B", "Planta Tipo C"].map((title, index) => (
                <article key={title} className="samfer-floor-card samfer-animate">
                  <header>
                    <h3>{title}</h3>
                    <p>{index === 0 ? "2 dormitórios • 42 m²" : index === 1 ? "2 dormitórios • 44 m²" : "2 dormitórios • compacta"}</p>
                  </header>
                  <img src={samferImages.floor} alt={title} />
                  <button type="button" className="samfer-primary-btn">
                    Ver planta completa
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="samfer-section">
            <SectionTitle before="Diferenciais do " highlight="empreendimento" />
            <div className="samfer-differentials">
              {differentials.map((item) => (
                <article key={item} className="samfer-differential-card samfer-animate">
                  {item}
                </article>
              ))}
            </div>
          </section>

          <section className="samfer-section">
            <SectionTitle before="Você também " highlight="pode gostar" />
            <div className="samfer-card-grid">
              {related.map((item, index) => (
                <PropertyCard key={item.id} project={item} theme={theme} index={index} />
              ))}
            </div>
          </section>

          <section className="samfer-price-highlight samfer-animate">
            <small>A partir de</small>
            <strong>{price}</strong>
          </section>
        </main>

        <SamferFooter />
      </div>
    </div>
  );
}

