type Props = {
  before?: string;
  highlight?: string;
  after?: string;
  trailingHighlight?: string;
};

export function SectionTitle({ before = "", highlight = "", after = "", trailingHighlight = "" }: Props) {
  return (
    <h2 className="samfer-title samfer-animate">
      {before}
      {highlight ? <span>{highlight}</span> : null}
      {after}
      {trailingHighlight ? <span>{trailingHighlight}</span> : null}
    </h2>
  );
}

