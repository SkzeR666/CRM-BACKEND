import { Bath, BedDouble, CarFront, Ruler } from "lucide-react";

type PropertyFeaturesProps = {
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpots?: number | null;
  area?: number | null;
};

export function PropertyFeatures({ bedrooms, bathrooms, parkingSpots, area }: PropertyFeaturesProps) {
  const items = [
    { label: "Quartos", value: bedrooms ?? 0, icon: BedDouble },
    { label: "Banheiros", value: bathrooms ?? 0, icon: Bath },
    { label: "Vagas", value: parkingSpots ?? 0, icon: CarFront },
    { label: "Area m2", value: area ?? 0, icon: Ruler },
  ];

  return (
    <section className="space-y-4 rounded-[10px] border border-border bg-surface p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Caracteristicas</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article key={item.label} className="rounded-[10px] border border-border bg-surface-alt p-4">
            <item.icon size={16} className="text-foreground-secondary" />
            <p className="mt-3 text-xs text-muted-foreground">{item.label}</p>
            {/* AJUSTE: tamanho do numero */}
            <p className="text-lg font-semibold tracking-tight text-foreground">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}