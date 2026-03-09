/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next"

import { listProjects } from "@/lib/api/projects";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";
import { FaqList } from "@/components/samfer/faq";

import { faqItems, samferImages } from "@/components/samfer/content";
import { SamferContactForm } from "@/components/samfer/contact-form";
import { SamferSubmitButton } from "@/components/samfer/submit-button";
import { SamferMobileFilterOverlay } from "@/components/samfer/mobile-filter-overlay";
import { SamferFilterSelect } from "@/components/samfer/filter-select";
import { PRICE_RANGE_OPTIONS } from "@/components/samfer/texts";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildLocalBusinessJsonLd,
  buildWebsiteJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import { withThemeAndHash } from "@/lib/samfer-links";

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export const metadata: Metadata = createPageMetadata({
  title: "Imóveis em Taubaté | Apartamentos e Casas à venda",
  description:
    "Imóveis em destaque em Taubaté e região com filtros por cidade, tipo, quartos, suítes e faixa de preço. Atendimento consultivo e financiamento facilitado.",
  pathname: "/",
  keywords: [
    "imóveis em Taubaté",
    "apartamentos à venda Taubaté",
    "casas à venda Taubaté",
    "imobiliária Taubaté",
  ],
});

function uniqueSorted(values: Array<string | number | null | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string | number => value !== null && value !== undefined)),
  ).sort((a, b) => String(a).localeCompare(String(b)));
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const theme = resolveTheme(params.theme);

  const [featuredResult, allResult] = await Promise.all([
    listProjects({ limit: 6, is_featured: true }),
    listProjects({ limit: 120 }),
  ]);

  const featured = featuredResult.projects.length
    ? featuredResult.projects
    : allResult.projects.slice(0, 6);

  const cityOptions = uniqueSorted(allResult.projects.map((item) => item.city));
  const typeOptions = uniqueSorted(allResult.projects.map((item) => item.type));
  const suiteOptions = uniqueSorted(allResult.projects.map((item) => item.suites));
  const parkingOptions = uniqueSorted(allResult.projects.map((item) => item.parking_spots));
  const bedroomOptions = uniqueSorted(allResult.projects.map((item) => item.bedrooms));

  return (
    <div className={`samfer-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="samfer-shell">
        <SamferHeader theme={theme} contactHref={withThemeAndHash("/", "financiamento", theme)} />

        <main className="samfer-main">
          <JsonLd
            data={[
              buildLocalBusinessJsonLd(),
              buildWebsiteJsonLd(),
              buildBreadcrumbJsonLd([{ name: "Início", pathname: "/" }]),
              buildFaqJsonLd(faqItems),
            ]}
          />

          <section className="samfer-hero samfer-animate" aria-label="Destaque principal">
            <Image
              src={samferImages.hero}
              alt="Empreendimento em destaque"
              width={1920}
              height={1080}
              sizes="100vw"
            />
            <h1 className="samfer-sr-only">Imóveis para morar bem em Taubaté e região</h1>
          </section>

          <SamferMobileFilterOverlay triggerLabel="Buscar imóveis" overlayTitle="Buscar imóveis">
            <section className="samfer-section" aria-labelledby="busca-heading">
              <SectionTitle before="Veja opções " highlight="ideais" after=" para o seu " trailingHighlight="perfil" />
              <form className="samfer-filter-grid samfer-animate" method="GET" action="/imoveis" id="busca-heading">
                <input type="hidden" name="theme" value={theme} />
                <SamferFilterSelect
                  name="city"
                  placeholder="Região"
                  options={cityOptions.map((value) => ({ value: String(value), label: String(value) }))}
                />
                <SamferFilterSelect
                  name="type"
                  placeholder="Tipo"
                  options={typeOptions.map((value) => ({ value: String(value), label: String(value) }))}
                />
                <SamferFilterSelect
                  name="priceRange"
                  placeholder="Preço de venda"
                  options={PRICE_RANGE_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
                />
                <SamferFilterSelect
                  name="suites"
                  placeholder="Suítes"
                  options={suiteOptions.map((value) => ({ value: String(value), label: String(value) }))}
                />
                <SamferFilterSelect
                  name="parkingSpots"
                  placeholder="Vagas"
                  options={parkingOptions.map((value) => ({ value: String(value), label: String(value) }))}
                />
                <SamferFilterSelect
                  name="bedrooms"
                  placeholder="Quartos"
                  options={bedroomOptions.map((value) => ({ value: String(value), label: String(value) }))}
                />
                <SamferSubmitButton className="samfer-wide-cta samfer-grid-span" defaultLabel="Buscar imóveis" loadingLabel="Buscando imóveis..." />
              </form>
            </section>
          </SamferMobileFilterOverlay>

          <section className="samfer-section" id="empreendimentos">
            <SectionTitle before="Imóveis em " highlight="destaque" />
            <div className="samfer-card-grid">
              {featured.map((project, index) => (
                <PropertyCard key={project.id} project={project} theme={theme} index={index} />
              ))}
            </div>
          </section>

          <section className="samfer-section">
            <SectionTitle before="Perguntas " highlight="frequentes" />
            <FaqList />
          </section>

          <section className="samfer-section" id="financiamento">
            <SectionTitle before="Entre em " highlight="contato conosco" />
            <SamferContactForm source="home-page" />
          </section>
        </main>

        <SamferFooter theme={theme} />
      </div>
    </div>
  );
}
