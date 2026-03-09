"use client";

import { useEffect, useState } from "react";

type Props = {
  className?: string;
  defaultLabel: string;
  loadingLabel: string;
};

export function SamferSubmitButton({ className, defaultLabel, loadingLabel }: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <button
      type="submit"
      className={className}
      aria-busy={loading}
      onClick={() => setLoading(true)}
    >
      {loading ? loadingLabel : defaultLabel}
    </button>
  );
}
