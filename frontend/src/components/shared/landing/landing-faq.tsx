import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const items = [
  {
    question: "Como posso agendar uma visita ao imovel?",
    answer:
      "Voce pode entrar em contato pelo WhatsApp ou pelo formulario da pagina. Nossa equipe organiza a visita conforme sua disponibilidade.",
  },
  {
    question: "Voce ajuda com financiamento imobiliario?",
    answer:
      "Sim. Nossa equipe orienta simulacoes, documentos e etapas para facilitar sua aprovacao.",
  },
  {
    question: "Os imoveis anunciados estao atualizados?",
    answer:
      "Sim. A listagem e alimentada por dados reais e recebe atualizacoes constantes de disponibilidade.",
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