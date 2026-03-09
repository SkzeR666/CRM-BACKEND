"use client";

import { FormEvent, useState } from "react";

const ADMIN_KEY_STORAGE = "crm_admin_api_key";

export function AdminLoginFormLocal() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    window.localStorage.setItem(ADMIN_KEY_STORAGE, value.trim());
    setMessage("Chave salva no navegador.");
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <section className="admin-form-section">
        <h2>
          Chave <span>administrativa</span>
        </h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="samfer-sr-only">Admin API key</span>
            <input
              name="admin-key"
              placeholder="admin api key"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              required
            />
          </label>
        </div>
      </section>

      <div className="admin-form-actions">
        <button type="submit" className="admin-primary-btn is-large">
          Salvar chave
        </button>
      </div>

      {message ? <p className="admin-feedback is-success">{message}</p> : null}
    </form>
  );
}
