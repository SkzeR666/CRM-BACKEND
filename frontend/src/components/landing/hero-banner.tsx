import Image from "next/image";
import { Container } from "@/components/ui/container";

type HeroBannerProps = {
  imageSrc: string;
  imageAlt: string;
};

export function HeroBanner({ imageSrc, imageAlt }: HeroBannerProps) {
  return (
    <section aria-label="Destaque principal">
      <Container>
        <div className="overflow-hidden rounded-[10px] border border-subtle h-[340px] sm:h-[460px] md:h-[800px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1440}
            height={800}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </Container>
    </section>
  );
}