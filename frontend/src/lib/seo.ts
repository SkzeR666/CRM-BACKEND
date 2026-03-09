import type { Metadata } from "next";
import type { Project } from "@/types/project";
import { samferImages } from "@/components/samfer/content";

const FALLBACK_SITE_URL = "https://crm-frontend-one-lovat.vercel.app";

export const brandName = "Samfer Imóveis";
export const defaultTitle = "Imóveis em Taubaté e região";
export const defaultDescription =
  "Encontre apartamentos e casas à venda em Taubaté e região com a Samfer Imóveis. Filtros por bairro, tipo, quartos, suítes, vagas e faixa de preço.";
export const defaultKeywords = [
  "imóveis em Taubaté",
  "apartamentos em Taubaté",
  "casas à venda em Taubaté",
  "imobiliária em Taubaté",
  "empreendimentos Taubaté",
  "financiamento imobiliário Taubaté",
];

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
  keywords?: string[];
};

export function createPageMetadata(input: CreatePageMetadataInput): Metadata {
  const absoluteImages = (input.images ?? []).map((image) =>
    image.startsWith("http") ? image : toAbsoluteUrl(image),
  );
  const keywords = input.keywords?.length ? input.keywords : defaultKeywords;

  return {
    title: input.title,
    description: input.description,
    keywords,
    category: "Real Estate",
    applicationName: brandName,
    creator: brandName,
    publisher: brandName,
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
    "@id": `${siteUrl}/#realestateagent`,
    name: brandName,
    url: siteUrl,
    image: samferImages.hero,
    logo: samferImages.avatar,
    description: defaultDescription,
    telephone: "+55-12-99999-9999",
    email: "contato@samfer.com.br",
    areaServed: "Taubaté, SP",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Taubaté",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    sameAs: ["https://www.instagram.com/", "https://www.facebook.com/"],
  };
}

export function buildWebsiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: brandName,
    url: siteUrl,
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/imoveis?city={city}&type={type}&priceRange={priceRange}`,
      "query-input": [
        "required name=city",
        "required name=type",
        "required name=priceRange",
      ],
    },
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
      addressLocality: project.city || "Taubaté",
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
    additionalProperty: [
      project.bedrooms ? { "@type": "PropertyValue", name: "Dormitórios", value: project.bedrooms } : null,
      project.suites ? { "@type": "PropertyValue", name: "Suítes", value: project.suites } : null,
      project.bathrooms ? { "@type": "PropertyValue", name: "Banheiros", value: project.bathrooms } : null,
      project.parking_spots ? { "@type": "PropertyValue", name: "Vagas", value: project.parking_spots } : null,
    ].filter(Boolean),
  };
}
