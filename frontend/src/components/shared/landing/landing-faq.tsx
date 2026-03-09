import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const items = [
  {
    question: "Como posso agendar uma visita ao imóvel?",
    answer:
      "Você pode entrar em contato pelo WhatsApp ou pelo formulário da página. Nossa equipe organiza a visita conforme sua disponibilidade.",
  },
  {
    question: "Vocês ajudam com financiamento imobiliário?",
    answer:
      "Sim. Nossa equipe orienta simulações, documentação e etapas para facilitar sua aprovação.",
  },
  {
    question: "Os imóveis anunciados estão atualizados?",
    answer:
      "Sim. A listagem é alimentada por dados reais e recebe atualizações constantes de disponibilidade.",
  },
];

export function LandingFaq() {
  return (
    <Section className="py-8">
      <Container className="animate-fade-up max-w-[1440px] space-y-6 px-3 anim-delay-2 md:px-0">
        <h2 className="text-center text-[28px] font-bold tracking-[-0.36px] text-foreground md:text-[36px]">
          Perguntas <span className="text-primary">frequentes</span>
        </h2>
        <FaqAccordion items={items} />
      </Container>
    </Section>
  );
}
