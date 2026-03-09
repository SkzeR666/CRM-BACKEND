import Image from "next/image";
import type { Project } from "@/types/project";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

type LandingHeroProps = {
  project?: Project;
};

const fallbackImage = "/images/hero-property.jpg";

export function LandingHero({ project }: LandingHeroProps) {
  const image = project?.cover_image || project?.gallery?.[0] || fallbackImage;

  return (
    <Section className="pb-0 pt-0">
      <Container className="animate-fade-up max-w-[1440px] px-3 md:px-0">
        <div className="overflow-hidden rounded-[10px] border border-border">
          {/* AJUSTE: altura do hero */}
          <Image src={image} alt={project?.title || "Empreendimento em destaque"} className="h-[320px] w-full object-cover md:h-[800px]" width={1920} height={1080} sizes="100vw" />
        </div>
      </Container>
    </Section>
  );
}