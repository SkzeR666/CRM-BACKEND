import { Container } from "@/components/ui/container";
import { PropertyItem } from "@/data/landing";
import { PropertyCard } from "@/components/landing/property-card";
import { motion } from "framer-motion";

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

        <div className="mt-4 md:mt-6">
          {properties.length === 0 ? (
            <div className="bg-surface border border-subtle rounded-[10px] p-6 text-center md:p-10">
              <p className="body-md text-secondary">
                Nenhum imóvel encontrado com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:gap-[30px] xl:grid-cols-2">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}