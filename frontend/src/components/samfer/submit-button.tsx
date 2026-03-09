"use client";

import { useState } from "react";

type Props = {
  className?: string;
  defaultLabel: string;
  loadingLabel: string;
};

export function SamferSubmitButton({ className, defaultLabel, loadingLabel }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="submit"
      className={className}
      disabled={loading}
      aria-busy={loading}
      onClick={() => setLoading(true)}
    >
      {loading ? loadingLabel : defaultLabel}
    </button>
  );
}
