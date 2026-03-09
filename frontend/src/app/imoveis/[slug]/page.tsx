import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { listProjects, getProjectBySlug } from "@/lib/api/projects";
import { formatPrice } from "@/lib/utils/format-price";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";
import { SamferContactLink } from "@/components/samfer/contact-link";
import { JsonLd } from "@/components/seo/json-ld";
import { differentials, getFallbackCover, samferImages } from "@/components/samfer/content";
import { buildBreadcrumbJsonLd, buildPropertyJsonLd, createPageMetadata } from "@/lib/seo";
import { buildContactMessage, buildMailtoLink, buildWhatsAppLink } from "@/lib/samfer-links";

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    return createPageMetadata({
      title: "Imóvel não encontrado",
      description: "O imóvel solicitado não foi encontrado ou não está mais disponível.",
      pathname: `/imoveis/${resolvedParams.slug}`,
      noIndex: true,
    });
  }

  const description =
    project.description ||
    `Detalhes do imóvel ${project.title} em ${project.city || "Taubaté"} com imagens, características e contato.`;

  return createPageMetadata({
    title: project.title,
    description,
    pathname: `/imoveis/${project.slug}`,
    images: project.cover_image ? [project.cover_image] : undefined,
  });
}

function getFeatureItems(project: NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>) {
  return [
    typeof project.bedrooms === "number" && project.bedrooms > 0
      ? `${project.bedrooms} dormitórios`
      : null,
    typeof project.suites === "number" && project.suites > 0 ? `${project.suites} suítes` : null,
    typeof project.parking_spots === "number" && project.parking_spots > 0 ? `${project.parking_spots} vagas` : null,
    typeof project.area_m2 === "number" && project.area_m2 > 0 ? `${project.area_m2} m²` : null,
  ].filter((item): item is string => Boolean(item));
}

export default async function PropertyBySlugPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const theme = resolveTheme(resolvedSearchParams.theme);

  const project = await getProjectBySlug(resolvedParams.slug);
  if (!project) notFound();

  const relatedResult = await listProjects({ city: project.city ?? undefined, limit: 6 });
  const related = relatedResult.projects.filter((item) => item.slug !== project.slug).slice(0, 2);

  const gallery = [project.cover_image, ...(project.gallery ?? [])].filter((value): value is string => Boolean(value));
  const images = gallery.length
    ? gallery
    : [getFallbackCover(project, 0), samferImages.galleryA, samferImages.galleryB, samferImages.galleryC];

  const heroImage = images[0];
  const thumbImages = [images[1] || samferImages.galleryA, images[2] || samferImages.galleryB, images[3] || samferImages.galleryC];
  const remainingCount = Math.max(0, images.length - 4);

  const location = [project.city, project.state].filter(Boolean).join(" - ") || "Taubaté - SP";
  const message = buildContactMessage(project);
  const whatsappHref = buildWhatsAppLink(message);
  const mailtoHref = buildMailtoLink(`Interesse no imóvel ${project.title}`, message);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", pathname: "/" },
    { name: "Imóveis", pathname: "/imoveis" },
    { name: project.title, pathname: `/imoveis/${project.slug}` },
  ]);

  const propertyJsonLd = buildPropertyJsonLd(project);
  const featureItems = getFeatureItems(project);

  const floorPlans = [
    { title: "Planta Tipo A", details: "2 dormitórios • 42 m²" },
    { title: "Planta Tipo B", details: "2 dormitórios • 44 m²" },
    { title: "Planta Tipo C", details: "Variante compacta" },
  ];

  const price = typeof project.price === "number" ? formatPrice(project.price) : "Sob consulta";

  return (
    <div className={`samfer-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="samfer-shell">
        <SamferHeader theme={theme} title={project.title} backHref="/imoveis" contactHref={whatsappHref} />

        <main className="samfer-main">
          <JsonLd data={[breadcrumbJsonLd, propertyJsonLd]} />

          <section className="samfer-gallery-hero samfer-animate">
            <Image src={heroImage} alt={project.title} className="samfer-gallery-main" width={1920} height={1080} sizes="100vw" />
            <div className="samfer-gallery-grid">
              {thumbImages.map((image, index) => (
                <a
                  key={image}
                  href={image}
                  target="_blank"
                  rel="noreferrer"
                  className={`samfer-gallery-thumb ${index === 2 && remainingCount > 0 ? "is-overlay" : ""}`}
                >
                  <Image src={image} alt={`${project.title} ${index + 2}`} width={800} height={600} sizes="(max-width: 860px) 100vw, 33vw" />
                  {index === 2 && remainingCount > 0 ? <span>+ {remainingCount} Imagens</span> : null}
                </a>
              ))}
            </div>
          </section>

          <section className="samfer-detail-top">
            <article className="samfer-detail-summary samfer-animate">
              <h1>{`${project.type || "Apartamentos"} | ${project.neighborhood || "Jardim Santa Tereza"}`}</h1>
              <h2>{project.title}</h2>
              <p>{location}</p>
              <hr />
              <p className="samfer-text-strong">Conheça seu novo apartamento!</p>
              <p>{project.description || "Empreendimento com excelente localização, conforto e praticidade."}</p>
              {featureItems.length ? (
                <ul>
                  {featureItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>

            <aside className="samfer-detail-cta samfer-animate">
              <h3>Fale com um especialista</h3>
              <p>Tire dúvidas e veja condições do imóvel</p>
              <Image src={samferImages.map} alt="Mapa da localização" width={900} height={420} sizes="(max-width: 860px) 100vw, 460px" />
              <div className="samfer-detail-cta-actions">
                <SamferContactLink
                  href={whatsappHref}
                  newTab
                  location="property_detail_whatsapp"
                  className="samfer-primary-btn"
                >
                  Falar com especialista
                </SamferContactLink>
                <SamferContactLink
                  href={mailtoHref}
                  location="property_detail_email"
                  className="samfer-secondary-btn"
                >
                  Enviar e-mail
                </SamferContactLink>
              </div>
            </aside>
          </section>

          <section className="samfer-section" id="plantas">
            <SectionTitle before="Plantas " highlight="disponiveis" />
            <div className="samfer-floor-grid">
              {floorPlans.map((plan) => (
                <article key={plan.title} className="samfer-floor-card samfer-animate">
                  <header>
                    <h3>{plan.title}</h3>
                    <p>{plan.details}</p>
                  </header>
                  <Image src={samferImages.floor} alt={plan.title} width={900} height={900} sizes="(max-width: 860px) 100vw, 33vw" />
                  <a href={samferImages.floor} target="_blank" rel="noreferrer" className="samfer-primary-btn">
                    Ver planta completa
                  </a>
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

          {related.length ? (
            <section className="samfer-section" id="empreendimentos">
              <SectionTitle before="Voce tambem " highlight="pode gostar" />
              <div className="samfer-card-grid">
                {related.map((item, index) => (
                  <PropertyCard key={item.id} project={item} theme={theme} index={index} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="samfer-price-highlight samfer-animate">
            <small>A partir de</small>
            <strong>{price}</strong>
          </section>
        </main>

        <SamferFooter theme={theme} />
      </div>
    </div>
  );
}
