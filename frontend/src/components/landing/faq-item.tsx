"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaqItem } from "@/data/landing";

type FaqItemProps = {
  item: FaqItem;
};

export function FaqAccordionItem({ item }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface border border-subtle rounded-[10px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left md:px-6 md:py-6"
      >
        <span className="label-lg text-primary">{item.question}</span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0"
        >
          <ChevronDown
            size={18}
            strokeWidth={1.8}
            className="text-icon-default md:size-5"
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 md:px-6 md:pb-6">
              <p className="body-sm text-secondary max-w-[900px]">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}