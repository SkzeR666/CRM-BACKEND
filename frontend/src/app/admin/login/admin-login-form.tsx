"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Admin API key"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="w-full">
        Salvar chave
      </Button>
      {message ? <p className="text-sm text-green-600">{message}</p> : null}
    </form>
  );
}