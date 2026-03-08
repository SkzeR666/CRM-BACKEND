import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { LandingContactForm } from "@/components/shared/landing/landing-contact-form";

export function LandingContact() {
  return (
    <Section id="contato" className="py-8">
      <Container className="animate-fade-up max-w-[1440px] space-y-6 px-3 anim-delay-3 md:px-0">
        <h2 className="text-center text-[28px] font-bold tracking-[-0.36px] text-foreground md:text-[36px]">
          Entre em <span className="text-primary">contato conosco</span>
        </h2>
        <LandingContactForm />
      </Container>
    </Section>
  );
}