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
import { MotionReveal, MotionStagger, MotionStaggerItem } from "@/components/samfer/motion-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { differentials, getFallbackCover, samferImages } from "@/components/samfer/content";
import { buildBreadcrumbJsonLd, buildPropertyJsonLd, buildWebsiteJsonLd, createPageMetadata } from "@/lib/seo";
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
    title: `${project.title} | Imóvel em ${project.city || "Taubaté"}`,
    description,
    pathname: `/imoveis/${project.slug}`,
    images: project.cover_image ? [project.cover_image] : undefined,
    keywords: [
      `${project.type || "imóvel"} em ${project.city || "Taubaté"}`,
      `${project.title} à venda`,
      "imóvel com financiamento",
    ],
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

  const [relatedByCityResult, relatedGeneralResult] = await Promise.all([
    listProjects({ city: project.city ?? undefined, limit: 8 }),
    listProjects({ limit: 12 }),
  ]);

  const related = [...relatedByCityResult.projects, ...relatedGeneralResult.projects]
    .filter((item) => item.slug !== project.slug)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index)
    .slice(0, 2);

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

  const price = typeof project.price === "number" ? formatPrice(project.price) : "Sob consulta";
  const mapQuery = [project.title, project.neighborhood, project.city, project.state, "Brasil"].filter(Boolean).join(", ");
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <div className={`samfer-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="samfer-shell">
        <SamferHeader theme={theme} title={project.title} backHref="/imoveis" contactHref={whatsappHref} />

        <main className="samfer-main">
          <JsonLd data={[buildWebsiteJsonLd(), breadcrumbJsonLd, propertyJsonLd]} />

          <MotionReveal>
            <section className="samfer-gallery-hero">
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
          </MotionReveal>

          <section className="samfer-detail-top">
            <MotionReveal>
              <article className="samfer-detail-summary">
              <h1>{`${project.type || "Apartamentos"} | ${project.neighborhood || "Jardim Santa Tereza"}`}</h1>
              <h2>{project.title}</h2>
              <p>{location}</p>
              <hr />
              <p className="samfer-text-strong">Conheça seu novo apartamento!</p>
              <p>{project.description || "Empreendimento com excelente localização, conforto e praticidade."}</p>
              <p className="samfer-text-strong">{price}</p>
              {featureItems.length ? (
                <ul>
                  {featureItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              </article>
            </MotionReveal>

            <MotionReveal delay={0.06}>
              <aside className="samfer-detail-cta">
              <h3>Fale com nossa equipe</h3>
              <p>Estamos aqui para apoiar sua decisão com clareza e segurança.</p>
              <iframe
                className="samfer-detail-map"
                title={`Mapa do imóvel ${project.title}`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="samfer-detail-cta-actions">
                <SamferContactLink
                  href={whatsappHref}
                  newTab
                  location="property_detail_whatsapp"
                  className="samfer-primary-btn"
                >
                  Falar com nossa equipe
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
            </MotionReveal>
          </section>

          <section className="samfer-section">
            <SectionTitle before="Diferenciais do " highlight="empreendimento" />
            <MotionStagger className="samfer-differentials">
              {differentials.map((item) => (
                <MotionStaggerItem key={item}>
                  <article className="samfer-differential-card">
                    {item}
                  </article>
                </MotionStaggerItem>
              ))}
            </MotionStagger>
          </section>

          {related.length ? (
            <section className="samfer-section" id="empreendimentos">
              <SectionTitle before="Você também " highlight="pode gostar" />
              <MotionStagger className="samfer-card-grid">
                {related.map((item, index) => (
                  <MotionStaggerItem key={item.id}>
                    <PropertyCard project={item} theme={theme} index={index} />
                  </MotionStaggerItem>
                ))}
              </MotionStagger>
            </section>
          ) : null}
        </main>

        <SamferFooter theme={theme} />
      </div>
    </div>
  );
}
