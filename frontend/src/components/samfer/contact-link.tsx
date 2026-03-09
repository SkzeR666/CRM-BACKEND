"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { trackSamferEvent } from "@/lib/analytics";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  location: string;
  newTab?: boolean;
  rel?: string;
  feedback?: string;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:");
}

export function SamferContactLink({
  href,
  className,
  children,
  location,
  newTab = false,
  rel,
  feedback = "Abrindo canal de contato...",
}: Props) {
  const [status, setStatus] = useState("");

  const handleClick = () => {
    trackSamferEvent({
      event: "samfer_contact_click",
      category: "contact",
      action: "click",
      location,
      href,
    });
    setStatus(feedback);
  };

  const target = newTab ? "_blank" : undefined;
  const safeRel = rel || (newTab ? "noreferrer" : undefined);

  return (
    <>
      {isExternalHref(href) ? (
        <a href={href} className={className} target={target} rel={safeRel} onClick={handleClick}>
          {children}
        </a>
      ) : (
        <Link href={href} className={className} onClick={handleClick}>
          {children}
        </Link>
      )}
      <span className="samfer-sr-only" aria-live="polite">
        {status}
      </span>
    </>
  );
}
