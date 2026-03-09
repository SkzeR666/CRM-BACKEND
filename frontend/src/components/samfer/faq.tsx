"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "./content";

export function FaqList() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="samfer-faq">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article key={item.question} className={`samfer-faq-item ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="samfer-faq-trigger"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <div>
                <h3>{item.question}</h3>
                {isOpen && item.answer ? <p>{item.answer}</p> : null}
              </div>
              <ChevronDown size={18} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
