import type { Project } from "@/types/project";
import { LandingFeaturedCard } from "@/components/shared/landing/landing-featured-card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

type LandingFeaturedProps = {
  projects: Project[];
};

export function LandingFeatured({ projects }: LandingFeaturedProps) {
  return (
    <Section id="destaques" className="py-8">
      <Container className="animate-fade-up max-w-[1440px] space-y-6 px-3 anim-delay-1 md:px-0">
        <h2 className="text-center text-[28px] font-bold tracking-[-0.36px] text-foreground md:text-[36px]">
          Imóveis em <span className="text-primary">destaque</span>
        </h2>

        {projects.length === 0 ? (
          <p className="rounded-[10px] border border-border bg-surface-alt p-6 text-center text-sm text-muted-foreground">
            Nenhum imóvel em destaque disponível no momento.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.slice(0, 2).map((project) => (
              <LandingFeaturedCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}

