import { Container } from "@/components/ui/container";
import { TestimonialItem } from "@/data/landing";
import { TestimonialCard } from "@/components/landing/testimonial-card";

type TestimonialsSectionProps = {
  testimonials: TestimonialItem[];
};

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="pt-[72px] md:pt-[88px]">
      <Container>
        <div className="px-3 py-8 text-center">
          <h2 className="heading-xl text-primary">
            O que nossos <span className="text-[var(--primary)]">clientes dizem</span>
          </h2>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:mt-6 md:gap-6 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}