import type { Metadata } from "next";
import type { Project } from "@/types/project";

const FALLBACK_SITE_URL = "https://crm-frontend-one-lovat.vercel.app";

export const brandName = "Samfer Imoveis";
export const defaultTitle = "Imoveis em Taubate e regiao";
export const defaultDescription =
  "Encontre apartamentos e casas com condicoes facilitadas em Taubate e regiao com a Samfer Imoveis.";

function sanitizeUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.FRONTEND_ORIGIN ??
    process.env.NEXT_PUBLIC_FRONTEND_ORIGIN ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : FALLBACK_SITE_URL);

  return sanitizeUrl(raw || FALLBACK_SITE_URL);
}

export function toAbsoluteUrl(pathname = "/") {
  const base = getSiteUrl();
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${normalizedPath}`;
}

type CreatePageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  images?: string[];
  noIndex?: boolean;
};

export function createPageMetadata(input: CreatePageMetadataInput): Metadata {
  const absoluteImages = (input.images ?? []).map((image) =>
    image.startsWith("http") ? image : toAbsoluteUrl(image),
  );

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.pathname },
    openGraph: {
      title: input.title,
      description: input.description,
      type: "website",
      url: toAbsoluteUrl(input.pathname),
      siteName: brandName,
      locale: "pt_BR",
      images: absoluteImages.length ? absoluteImages : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: absoluteImages.length ? absoluteImages : undefined,
    },
    robots: input.noIndex ? { index: false, follow: true } : undefined,
  };
}

export function buildLocalBusinessJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: brandName,
    url: siteUrl,
    telephone: "+55-12-99999-9999",
    email: "contato@samfer.com.br",
    areaServed: "Taubate, SP",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Taubate",
      addressRegion: "SP",
      addressCountry: "BR",
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; pathname: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.pathname),
    })),
  };
}

export function buildPropertyJsonLd(project: Project) {
  const pathname = `/imoveis/${project.slug}`;
  const images = [project.cover_image, ...(project.gallery ?? [])].filter(
    (value): value is string => Boolean(value),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.title,
    description: project.description || defaultDescription,
    url: toAbsoluteUrl(pathname),
    image: images,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.city || "Taubate",
      addressRegion: project.state || "SP",
      addressCountry: "BR",
    },
    numberOfRooms: project.bedrooms ?? undefined,
    floorSize:
      typeof project.area_m2 === "number"
        ? {
            "@type": "QuantitativeValue",
            value: project.area_m2,
            unitCode: "MTK",
          }
        : undefined,
    offers:
      typeof project.price === "number"
        ? {
            "@type": "Offer",
            price: project.price,
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            url: toAbsoluteUrl(pathname),
          }
        : undefined,
  };
}
