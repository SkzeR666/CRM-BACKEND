"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  placeholder: string;
  options: Option[];
  defaultValue?: string;
};

export function SamferFilterSelect({ name, placeholder, options, defaultValue = "" }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return options.find((option) => option.value === value)?.label || "";
  }, [options, value]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const hasValue = Boolean(value);

  return (
    <div
      ref={rootRef}
      className={`samfer-select-card samfer-select-custom ${isOpen ? "is-open" : ""} ${hasValue ? "is-selected" : ""}`}
    >
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        className="samfer-select-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={placeholder}
      >
        <span>{selectedLabel || placeholder}</span>
        <ChevronDown size={18} />
      </button>

      {isOpen ? (
        <div className="samfer-select-dropdown" role="listbox" aria-label={placeholder}>
          <button
            type="button"
            className={`samfer-select-option ${!hasValue ? "is-active" : ""}`}
            onClick={() => {
              setValue("");
              setIsOpen(false);
            }}
          >
            {placeholder}
          </button>
          {options.map((option) => {
            const active = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`samfer-select-option ${active ? "is-active" : ""}`}
                onClick={() => {
                  setValue(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

