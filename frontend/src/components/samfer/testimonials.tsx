import { Star } from "lucide-react";
import Image from "next/image";
import { testimonials } from "./content";

export function Testimonials() {
  return (
    <div className="samfer-testimonials">
      {testimonials.map((item) => (
        <article key={item.id} className="samfer-testimonial samfer-animate">
          <div className="samfer-stars">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index}>
                <Star size={14} fill="currentColor" />
              </span>
            ))}
          </div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <div className="samfer-user">
            <Image src={item.avatar} alt={item.name} width={92} height={92} sizes="46px" />
            <div>
              <strong>{item.name}</strong>
              <small>{item.city}</small>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

