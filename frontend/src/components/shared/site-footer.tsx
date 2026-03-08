import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer id="contato" className="mt-16 border-t border-border bg-surface">
      <Container className="flex flex-col gap-2 py-8 text-sm text-foreground-secondary md:flex-row md:items-center md:justify-between">
        <p>Samfer Imoveis</p>
        <p>Contato comercial via formulario dos imoveis.</p>
      </Container>
    </footer>
  );
}