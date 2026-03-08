"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Item = { question: string; answer: string };

type FaqAccordionProps = {
  items: Item[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = index === openIndex;

        return (
          <article key={item.question} className="rounded-[10px] border border-border bg-surface-alt px-6 py-5">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="text-base font-semibold text-foreground-secondary">{item.question}</span>
              <ChevronDown size={18} className={isOpen ? "rotate-180 text-icon transition" : "text-icon transition"} />
            </button>
            {isOpen ? <p className="mt-4 text-sm text-foreground-secondary">{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
}