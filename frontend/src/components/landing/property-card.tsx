import Image from "next/image";
import { PropertyItem } from "@/data/landing";

type PropertyCardProps = {
  property: PropertyItem;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="bg-surface radius-md overflow-hidden">
      <div className="relative h-[280px] w-full">
        <Image
          src={property.imageSrc}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-10">
        <div className="space-y-3">
          <h3 className="heading-sm text-primary">{property.title}</h3>
          <p className="body-sm text-secondary">{property.location}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="bg-surface-alt radius-sm label-sm text-secondary inline-flex items-center px-4 py-3">
            {property.bedrooms} quartos
          </span>
          <span className="bg-surface-alt radius-sm label-sm text-secondary inline-flex items-center px-4 py-3">
            {property.suites} suítes
          </span>
          <span className="bg-surface-alt radius-sm label-sm text-secondary inline-flex items-center px-4 py-3">
            {property.parkingSpots} vagas
          </span>
        </div>

        <div className="mt-8 flex items-end justify-between gap-6">
          <div>
            <p className="caption text-muted">A partir de</p>
            <p className="price-lg text-primary mt-2">{formatPrice(property.price)}</p>
          </div>

          <button
            type="button"
            className="bg-primary text-on-primary radius-sm label-md inline-flex h-[53px] items-center justify-center px-6"
          >
            Ver imóvel
          </button>
        </div>
      </div>
    </article>
  );
}