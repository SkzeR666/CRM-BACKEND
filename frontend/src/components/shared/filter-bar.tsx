import Link from "next/link";
import { Search } from "lucide-react";

type FilterBarProps = {
  action: string;
  city?: string;
  status?: string;
  cities?: string[];
};

const statusOptions = [
  { value: "available", label: "Disponivel" },
  { value: "reserved", label: "Reservado" },
  { value: "sold", label: "Vendido" },
];

export function FilterBar({ action, city, status, cities = [] }: FilterBarProps) {
  return (
    <form action={action} className="rounded-[10px] border border-border bg-surface p-4 md:p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto_auto]">
        <div className="space-y-2">
          <label htmlFor="filter-city" className="text-sm font-medium text-foreground">
            Cidade
          </label>
          {/* AJUSTE: altura do campo */}
          <select
            id="filter-city"
            name="city"
            defaultValue={city ?? ""}
            className="h-11 w-full rounded-[10px] border border-border bg-surface-alt px-4 text-sm text-foreground outline-none transition focus:border-primary"
          >
            <option value="">Todas</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="filter-status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={status ?? ""}
            className="h-11 w-full rounded-[10px] border border-border bg-surface-alt px-4 text-sm text-foreground outline-none transition focus:border-primary"
          >
            <option value="">Todos</option>
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-[10px] bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
        >
          <Search size={16} />
          Filtrar
        </button>

        <Link
          href={action}
          className="inline-flex h-11 items-center justify-center self-end rounded-[10px] border border-border px-5 text-sm font-medium text-foreground transition hover:bg-surface-alt"
        >
          Limpar
        </Link>
      </div>
    </form>
  );
}