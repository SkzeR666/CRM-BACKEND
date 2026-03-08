import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const testimonials = [
  {
    title: "Trabalho incrivel!",
    quote:
      "Consegui entender melhor meu financiamento e escolher uma opcao que cabia no meu bolso. O atendimento foi rapido, claro e fez toda a diferenca.",
    author: "Joao Carlos",
    city: "Taubate, SP",
  },
  {
    title: "Trabalho incrivel!",
    quote:
      "Consegui entender melhor meu financiamento e escolher uma opcao que cabia no meu bolso. O atendimento foi rapido, claro e fez toda a diferenca.",
    author: "Joao Carlos",
    city: "Taubate, SP",
  },
  {
    title: "Trabalho incrivel!",
    quote:
      "Consegui entender melhor meu financiamento e escolher uma opcao que cabia no meu bolso. O atendimento foi rapido, claro e fez toda a diferenca.",
    author: "Joao Carlos",
    city: "Taubate, SP",
  },
];

function initials(name: string) {
  const parts = name.split(" ");
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function LandingTestimonials() {
  return (
    <Section className="py-8">
      <Container className="animate-fade-up max-w-[1440px] space-y-6 px-3 anim-delay-1 md:px-0">
        <h2 className="text-center text-[28px] font-bold tracking-[-0.36px] text-foreground md:text-[36px]">
          O que nossos <span className="text-primary">clientes dizem</span>
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <article
              key={`${item.author}-${index}`}
              className="rounded-[10px] border border-border bg-surface-alt px-5 py-10 transition duration-300 hover:-translate-y-0.5"
            >
              <div className="mb-4 flex items-center gap-[10px]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <span
                    key={`${item.author}-${index}-star-${starIndex}`}
                    className="inline-flex size-[34px] items-center justify-center rounded-full bg-gold-soft text-gold"
                  >
                    <Star size={14} fill="currentColor" strokeWidth={1.5} />
                  </span>
                ))}
              </div>

              <h3 className="text-[18px] font-semibold text-foreground">{item.title}</h3>
              <p className="mt-[14px] text-sm leading-6 text-foreground-secondary">{item.quote}</p>

              <div className="mt-6 flex items-center gap-3">
                <div className="inline-flex size-[60px] items-center justify-center rounded-full bg-surface text-sm font-semibold text-foreground">
                  {initials(item.author)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.author}</p>
                  <p className="text-xs text-muted-foreground">{item.city}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}