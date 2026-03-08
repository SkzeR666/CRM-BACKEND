import { ChevronDown } from "lucide-react";
import { faqItems } from "./content";

export function FaqList() {
  return (
    <div className="samfer-faq">
      {faqItems.map((item, index) => (
        <article key={item.question} className={`samfer-faq-item ${index === 0 ? "is-open" : ""}`}>
          <div>
            <h3>{item.question}</h3>
            {item.answer ? <p>{item.answer}</p> : null}
          </div>
          <ChevronDown size={18} />
        </article>
      ))}
    </div>
  );
}

