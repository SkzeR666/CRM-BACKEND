import type { Metadata } from "next";
import { listProjects } from "@/lib/api/projects";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";
import { FaqList } from "@/components/samfer/faq";
import { Testimonials } from "@/components/samfer/testimonials";
import { samferImages } from "@/components/samfer/content";
import { SamferContactForm } from "@/components/samfer/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import { withThemeAndHash } from "@/lib/samfer-links";

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

export const metadata: Metadata = createPageMetadata({
  title: "Inicio",
  description:
    "Imoveis em destaque em Taubate e regiao com filtros por cidade, tipo, quartos, suites e faixa de preco.",
  pathname: "/",
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
    listProjects({ limit: 6, featured: true }),
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
              buildBreadcrumbJsonLd([{ name: "Inicio", pathname: "/" }]),
            ]}
          />

          <section className="samfer-hero samfer-animate" aria-label="Destaque principal">
            <img src={samferImages.hero} alt="Empreendimento em destaque" />
            <h1 className="samfer-sr-only">Imoveis para morar bem em Taubate e regiao</h1>
          </section>

          <section className="samfer-section" aria-labelledby="busca-heading">
            <SectionTitle before="Veja opcoes " highlight="ideais" after=" para o seu perfil" />
            <form className="samfer-filter-grid samfer-animate" method="GET" action="/imoveis" id="busca-heading">
              <input type="hidden" name="theme" value={theme} />
              <label className="samfer-select-card">
                <select name="city" defaultValue="">
                  <option value="">Regiao</option>
                  {cityOptions.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="samfer-select-card">
                <select name="type" defaultValue="">
                  <option value="">Tipo</option>
                  {typeOptions.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="samfer-select-card">
                <select name="priceRange" defaultValue="">
                  <option value="">Preco de venda</option>
                  <option value="0-300000">Ate R$ 300.000</option>
                  <option value="300000-600000">R$ 300.000 a R$ 600.000</option>
                  <option value="600000-999999999">Acima de R$ 600.000</option>
                </select>
              </label>
              <label className="samfer-select-card">
                <select name="suites" defaultValue="">
                  <option value="">Suites</option>
                  {suiteOptions.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="samfer-select-card">
                <select name="parkingSpots" defaultValue="">
                  <option value="">Vagas</option>
                  {parkingOptions.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="samfer-select-card">
                <select name="bedrooms" defaultValue="">
                  <option value="">Quartos</option>
                  {bedroomOptions.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <button className="samfer-wide-cta samfer-grid-span" type="submit">
                Buscar imoveis
              </button>
            </form>
          </section>

          <section className="samfer-section" id="empreendimentos">
            <SectionTitle before="Imoveis em " highlight="destaque" />
            <div className="samfer-card-grid">
              {featured.map((project, index) => (
                <PropertyCard key={project.id} project={project} theme={theme} index={index} />
              ))}
            </div>
          </section>

          <section className="samfer-section">
            <SectionTitle before="O que nossos " highlight="clientes dizem" />
            <Testimonials />
          </section>

          <section className="samfer-section">
            <SectionTitle before="Perguntas " highlight="frequentes" />
            <FaqList />
          </section>

          <section className="samfer-section" id="financiamento">
            <SectionTitle before="Entre em " highlight="contato conosco" />
            <SamferContactForm source="home-page" contextLabel="Atendimento comercial para compra de imovel" />
          </section>
        </main>

        <SamferFooter theme={theme} />
      </div>
    </div>
  );
}

