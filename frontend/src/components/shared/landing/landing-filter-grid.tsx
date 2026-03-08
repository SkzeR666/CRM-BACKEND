import { ChevronDown } from "lucide-react";

type LandingFilterGridProps = {
  cities: string[];
};

const fieldClassName =
  "h-[80px] w-full appearance-none rounded-[10px] border border-border bg-surface-alt px-6 pr-11 text-[14px] font-medium text-foreground-secondary outline-none transition focus:border-primary";

export function LandingFilterGrid({ cities }: LandingFilterGridProps) {
  return (
    <form action="/imoveis" className="space-y-6">
      {/* AJUSTE: gap entre campos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="relative">
          <select name="city" defaultValue="" className={fieldClassName}>
            <option value="">Regiao</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
        </div>

        <div className="relative">
          <select name="type" defaultValue="" className={fieldClassName}>
            <option value="">Tipo</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
        </div>

        <div className="relative">
          <select name="price" defaultValue="" className={fieldClassName}>
            <option value="">Preco de venda</option>
            <option value="ate-300">Ate 300 mil</option>
            <option value="300-600">300 mil a 600 mil</option>
            <option value="acima-600">Acima de 600 mil</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
        </div>

        <div className="relative">
          <select name="suites" defaultValue="" className={fieldClassName}>
            <option value="">Suites</option>
            <option value="1">1 suite</option>
            <option value="2">2 suites</option>
            <option value="3">3+ suites</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
        </div>

        <div className="relative">
          <select name="parking" defaultValue="" className={fieldClassName}>
            <option value="">Vagas</option>
            <option value="1">1 vaga</option>
            <option value="2">2 vagas</option>
            <option value="3">3+ vagas</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
        </div>

        <div className="relative">
          <select name="status" defaultValue="" className={fieldClassName}>
            <option value="">Quartos</option>
            <option value="available">Disponivel</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-icon" />
        </div>
      </div>

      <button
        type="submit"
        className="h-[80px] w-full rounded-[10px] bg-primary px-6 text-[16px] font-semibold text-primary-foreground transition hover:bg-primary-hover"
      >
        Buscar Imoveis
      </button>
    </form>
  );
}