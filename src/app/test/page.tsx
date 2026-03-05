export default function Test() {
  return (
    <form action="/api/leads" method="post" style={{ padding: 24, display: "grid", gap: 12, maxWidth: 420 }}>
      <input name="nome" placeholder="nome" defaultValue="Lead Teste" />
      <input name="telefone" placeholder="telefone" defaultValue="12999999999" />
      <input name="origem" placeholder="origem" defaultValue="site" />
      <button type="submit">Enviar</button>
    </form>
  );
}