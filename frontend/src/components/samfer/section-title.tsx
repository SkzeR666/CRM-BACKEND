type Props = {
  before?: string;
  highlight?: string;
  after?: string;
};

export function SectionTitle({ before = "", highlight = "", after = "" }: Props) {
  return (
    <h2 className="samfer-title samfer-animate">
      {before}
      {highlight ? <span>{highlight}</span> : null}
      {after}
    </h2>
  );
}

