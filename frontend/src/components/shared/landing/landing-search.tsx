import { LandingFilterGrid } from "@/components/shared/landing/landing-filter-grid";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

type LandingSearchProps = {
  cities: string[];
};

export function LandingSearch({ cities }: LandingSearchProps) {
  return (
    <Section className="py-8 md:py-8">
      <Container className="animate-fade-up max-w-[1440px] space-y-6 px-3 anim-delay-1 md:px-0">
        <h2 className="text-center text-[28px] font-bold tracking-[-0.36px] text-foreground md:text-[36px]">
          Veja opcoes <span className="text-primary">ideais</span> para o seu <span className="text-primary">perfil</span>
        </h2>

        <LandingFilterGrid cities={cities} />
      </Container>
    </Section>
  );
}