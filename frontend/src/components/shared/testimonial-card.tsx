type TestimonialCardProps = {
  quote: string;
  author: string;
};

export function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <article className="space-y-3 rounded-[10px] border border-border bg-surface p-5">
      <p className="text-sm text-foreground-secondary">{quote}</p>
      <p className="text-sm font-medium text-foreground">{author}</p>
    </article>
  );
}