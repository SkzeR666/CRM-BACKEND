import { listProjects } from "@/lib/api/projects";
import { resolveTheme } from "@/lib/utils/theme";
import { SamferHeader } from "@/components/samfer/header";
import { SamferFooter } from "@/components/samfer/footer";
import { PropertyCard } from "@/components/samfer/property-card";
import { SectionTitle } from "@/components/samfer/section-title";
import { Testimonials } from "@/components/samfer/testimonials";
import { FaqList } from "@/components/samfer/faq";
import { samferImages } from "@/components/samfer/content";

type Props = {
  searchParams: Promise<{ theme?: string }> | { theme?: string };
};

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
    : allResult.projects.slice(0, 2);

  const cityOptions = uniqueSorted(allResult.projects.map((item) => item.city));
  const typeOptions = uniqueSorted(allResult.projects.map((item) => item.type));
  const suiteOptions = uniqueSorted(allResult.projects.map((item) => item.suites));
  const parkingOptions = uniqueSorted(allResult.projects.map((item) => item.parking_spots));
  const bedroomOptions = uniqueSorted(allResult.projects.map((item) => item.bedrooms));

  return (
    <div className={`samfer-app ${theme === "dark" ? "is-dark" : ""}`}>
      <div className="samfer-shell">
        <SamferHeader theme={theme} />

        <main className="samfer-main">
          <section className="samfer-hero samfer-animate">
            <img src={samferImages.hero} alt="Empreendimento em destaque" />
          </section>

          <section className="samfer-section">
            <SectionTitle before="Veja opcoes " highlight="ideais" after=" para o seu perfil" />
            <form className="samfer-filter-grid samfer-animate" method="GET" action="/imoveis">
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
                Buscar Imoveis
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
            <form className="samfer-contact-grid samfer-animate">
              <label className="samfer-input-card no-icon">
                <span>Nome Completo *</span>
              </label>
              <label className="samfer-input-card no-icon">
                <span>Telefone *</span>
              </label>
              <label className="samfer-input-card no-icon">
                <span>Email *</span>
              </label>
              <label className="samfer-input-card no-icon">
                <span>Assunto</span>
              </label>
              <label className="samfer-input-card no-icon samfer-message">
                <span>Mensagem</span>
              </label>
              <button type="submit" className="samfer-wide-cta">
                Enviar Email
              </button>
            </form>
          </section>
        </main>

        <SamferFooter />
      </div>
    </div>
  );
}
