import Image from "next/image";
type PropertyGalleryProps = {
  images?: string[] | null;
  title: string;
};

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  if (!images?.length) {
    return (
      <section className="rounded-[10px] border border-border bg-surface p-5 md:p-6">
        <h2 className="text-xl font-semibold tracking-tight">Galeria</h2>
        <p className="mt-2 text-sm text-muted-foreground">Sem imagens para este imovel.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-[10px] border border-border bg-surface p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight">Galeria</h2>
      {/* AJUSTE: espacamento entre cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <article key={`${image}-${index}`} className="overflow-hidden rounded-[10px] border border-border bg-surface-alt">
            <Image src={image} alt={`${title} ${index + 1}`} className="h-52 w-full object-cover" width={900} height={600} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          </article>
        ))}
      </div>
    </section>
  );
}