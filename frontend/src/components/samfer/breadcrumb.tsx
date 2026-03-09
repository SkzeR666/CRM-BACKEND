import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function SamferBreadcrumb({ items }: Props) {
  if (!items.length) return null;

  return (
    <nav className="samfer-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 ? <span className="samfer-breadcrumb-separator">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

