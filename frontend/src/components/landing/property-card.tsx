import Image from "next/image";
import { Bath, BedDouble, CarFront } from "lucide-react";
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

function Pill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className="
        bg-surface-alt border border-subtle text-secondary
        inline-flex h-[38px] items-center gap-2 rounded-[3px]
        px-3 md:h-[48px] md:gap-3 md:px-[14px]
      "
    >
      <span className="text-icon-default flex items-center justify-center">
        {icon}
      </span>
      <span className="label-sm whitespace-nowrap">{label}</span>
    </div>
  );
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article
      className="
        bg-surface border border-subtle group
        rounded-[10px] p-4
        transition-transform duration-300 ease-out
        hover:-translate-y-1
        md:p-10
      "
    >
      <div className="relative h-[220px] w-full overflow-hidden rounded-[6px] border border-subtle md:h-[460px]">
        <Image
          src={property.imageSrc}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </div>

      <div className="pt-4 md:pt-[30px]">
        <div>
          <h3 className="heading-sm text-primary">{property.title}</h3>
          <p className="body-sm text-secondary mt-2">
            {property.description}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 md:mt-8 md:gap-[10px]">
          <Pill
            icon={<BedDouble size={16} strokeWidth={1.8} />}
            label={`${property.bedrooms} dorm.`}
          />
          <Pill
            icon={<Bath size={16} strokeWidth={1.8} />}
            label={`${property.suites} suítes`}
          />
          <Pill
            icon={<CarFront size={16} strokeWidth={1.8} />}
            label={`${property.parkingSpots} vagas`}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 md:mt-8 md:gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="caption text-muted">A partir de</p>
            <p className="price-lg text-primary mt-1 md:mt-[2px]">
              {formatPrice(property.price)}
            </p>
          </div>

          <button
            type="button"
            className="
              bg-primary text-on-primary border border-subtle label-md
              inline-flex h-[50px] w-full items-center justify-center
              rounded-[6px] px-5
              transition-all duration-200 ease-out
              hover:brightness-[0.985]
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[var(--primary)]
              focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]
              md:h-[56px] md:px-6
              lg:max-w-[377px]
            "
          >
            Ver detalhes do imóvel
          </button>
        </div>
      </div>
    </article>
  );
}