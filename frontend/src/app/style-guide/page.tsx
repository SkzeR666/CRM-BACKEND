const palette = [
  { name: "Background Dark", hex: "#020307" },
  { name: "Background Light", hex: "#ECECEC" },
  { name: "Surface", hex: "#121417" },
  { name: "Surface Light", hex: "#FFFFFF" },
  { name: "Border Dark", hex: "#24272C" },
  { name: "Border Light", hex: "#D6D6D6" },
  { name: "Text", hex: "#FBFBFB" },
  { name: "Text Dark", hex: "#141414" },
  { name: "Muted", hex: "#95979B" },
  { name: "Accent", hex: "#3FCA7E" },
  { name: "Accent Strong", hex: "#30B96D" },
  { name: "Star", hex: "#D6BA61" },
];

const components = [
  ["Navbar", "72px", "Raio 14px", "Brand + links + CTA + toggle"],
  ["Hero", "16:9", "Raio 12px", "Imagem principal de capa"],
  ["Filtro", "72px", "Raio 10px", "Label + seta"],
  ["Card Imovel", "Auto", "Raio 12px", "Imagem, titulo, specs e preco"],
  ["Chip spec", "30px", "Raio 4px", "Icone + texto"],
  ["Botao primario", "62px", "Raio 8px", "Accent + texto escuro"],
  ["Depoimento", "Auto", "Raio 12px", "5 estrelas + copy + avatar"],
];

export default function StyleGuidePage() {
  return (
    <main className="landing theme-light">
      <div className="guide">
        <h1>Guia de estilo - SAMFRE Landing</h1>
        <p>
          Guia base para manter equivalencia visual entre Figma e implementacao. Os tokens abaixo estao
          aplicados nas versoes Dark e White da landing.
        </p>

        <section className="guide-section">
          <h2>Tipografia</h2>
          <p>
            <strong>Display:</strong> Sora (titulos grandes) | <strong>Body:</strong> Manrope (texto,
            labels e botoes)
          </p>
          <p style={{ fontFamily: "var(--font-sora)", fontSize: 42, margin: "8px 0" }}>
            Imoveis em destaque
          </p>
          <p style={{ fontFamily: "var(--font-manrope)", fontSize: 14, margin: 0 }}>
            Texto corrido para descricao, labels de formulario e conteudo dos cards.
          </p>
        </section>

        <section className="guide-section">
          <h2>Paleta</h2>
          <div className="color-grid">
            {palette.map((color) => (
              <article key={color.hex} className="color-card">
                <div className="color-chip" style={{ background: color.hex }} />
                <div className="color-meta">
                  <strong>{color.name}</strong>
                  <br />
                  {color.hex}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>Biblioteca de componentes</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e4e4e4", padding: "8px" }}>
                  Componente
                </th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e4e4e4", padding: "8px" }}>
                  Altura
                </th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e4e4e4", padding: "8px" }}>
                  Raio
                </th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e4e4e4", padding: "8px" }}>
                  Estrutura
                </th>
              </tr>
            </thead>
            <tbody>
              {components.map((item) => (
                <tr key={item[0]}>
                  {item.map((cell) => (
                    <td key={cell} style={{ borderBottom: "1px solid #f0f0f0", padding: "8px" }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
