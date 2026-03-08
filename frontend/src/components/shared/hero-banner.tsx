type HeroBannerProps = {
  imageUrl?: string | null;
  title?: string;
};

const fallbackImage = "/images/hero-property.jpg";

export function HeroBanner({ imageUrl, title = "Empreendimento em destaque" }: HeroBannerProps) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-border bg-surface">
      {/* AJUSTE: altura do hero */}
      <img src={imageUrl || fallbackImage} alt={title} className="h-[260px] w-full object-cover md:h-[420px]" />
    </section>
  );
}