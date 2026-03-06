import { Container } from "@/components/ui/container";
import { PropertyItem } from "@/data/landing";
import { PropertyCard } from "@/components/landing/property-card";

type FeaturedPropertiesProps = {
  properties: PropertyItem[];
};

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section id="imoveis" className="pt-[72px] md:pt-[88px]">
      <Container>
        <div className="px-3 py-8 text-center">
          <h2 className="heading-xl text-primary">
            Imóveis em <span className="text-[var(--primary)]">destaque</span>
          </h2>
        </div>

        <div className="mt-6">
          {properties.length === 0 ? (
            <div className="bg-surface border-subtle rounded-[10px] border p-10 text-center">
              <p className="body-md text-secondary">
                Nenhum imóvel encontrado com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[30px] xl:grid-cols-2">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}