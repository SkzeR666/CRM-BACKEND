import Image from "next/image";
import { Star } from "lucide-react";
import { TestimonialItem } from "@/data/landing";

type TestimonialCardProps = {
  testimonial: TestimonialItem;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="bg-surface border border-subtle rounded-[10px] p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < testimonial.rating;

          return (
            <div
              key={index}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-subtle md:h-11 md:w-11 ${
                filled ? "bg-gold-soft" : "bg-surface-alt"
              }`}
            >
              <Star
                size={15}
                strokeWidth={1.8}
                className={filled ? "text-gold fill-current" : "text-gold"}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 md:mt-8">
        <h3 className="heading-sm text-primary">{testimonial.title}</h3>
        <p className="body-sm text-secondary mt-3">{testimonial.content}</p>
      </div>

      <div className="mt-6 flex items-center gap-3 md:mt-8">
        <div className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full border border-subtle md:h-[60px] md:w-[60px]">
          <Image
            src={testimonial.avatarSrc}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="label-md text-primary truncate">{testimonial.name}</p>
          <p className="caption text-muted mt-1 truncate">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}