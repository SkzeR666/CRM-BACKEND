import { Container } from "@/components/ui/container";
import { FaqItem } from "@/data/landing";
import { FaqAccordionItem } from "@/components/landing/faq-item";

type FaqSectionProps = {
  items: FaqItem[];
};

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <section className="pt-[72px] md:pt-[88px]">
      <Container>
        <div className="px-3 py-8 text-center">
          <h2 className="heading-xl text-primary">
            Perguntas <span className="text-[var(--primary)]">frequentes</span>
          </h2>
        </div>

        <div className="mt-3 space-y-3 md:mt-6 md:space-y-4">
          {items.map((item) => (
            <FaqAccordionItem key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}