"use client";

import { useState } from "react";

const ADMIN_KEY_STORAGE = "crm_admin_api_key";

export default function AdminLoginPage() {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
  });
  const [message, setMessage] = useState("");

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    window.localStorage.setItem(ADMIN_KEY_STORAGE, value.trim());
    setMessage("Chave salva no navegador para chamadas administrativas da API.");
  }

  return (
    <main className="page-shell">
      <section className="card stack">
        <h1 className="title">Configurar chave administrativa</h1>
        <p className="muted">
          Esta tela salva localmente a chave usada no header <code>x-admin-key</code> para ambiente de
          desenvolvimento.
        </p>

        <form className="stack" onSubmit={handleSave}>
          <label className="label" htmlFor="admin-key">
            Admin API key
          </label>
          <input
            id="admin-key"
            className="input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Cole sua ADMIN_API_KEY"
          />
          <button className="button" type="submit">
            Salvar chave local
          </button>
          {message ? <p className="success">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
