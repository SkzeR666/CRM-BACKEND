"use client";

import { FormEvent, useMemo, useState } from "react";
import { createProject } from "@/lib/api/projects";
import type { ProjectStatus } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const ADMIN_KEY_STORAGE = "crm_admin_api_key";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type FormValues = {
  title: string;
  slug: string;
  city: string;
  status: ProjectStatus;
};

const initialValues: FormValues = {
  title: "",
  slug: "",
  city: "",
  status: "available",
};

export function PropertyFormLocal() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const finalSlug = useMemo(
    () => (values.slug ? slugify(values.slug) : slugify(values.title)),
    [values.slug, values.title],
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const adminKey = window.localStorage.getItem(ADMIN_KEY_STORAGE) ?? undefined;

      await createProject(
        {
          title: values.title,
          slug: finalSlug,
          city: values.city || undefined,
          status: values.status,
        },
        { adminKey },
      );

      setValues(initialValues);
      setMessage("Projeto criado com sucesso.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Erro ao criar projeto.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Titulo"
        value={values.title}
        onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
        required
      />

      <Input
        label="Slug"
        value={values.slug}
        onChange={(event) => setValues((prev) => ({ ...prev, slug: event.target.value }))}
        hint="Opcional. Se vazio, usa o titulo automaticamente."
      />

      <Input
        label="Cidade"
        value={values.city}
        onChange={(event) => setValues((prev) => ({ ...prev, city: event.target.value }))}
      />

      <Select
        label="Status"
        value={values.status}
        onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value as ProjectStatus }))}
      >
        <option value="available">available</option>
        <option value="reserved">reserved</option>
        <option value="sold">sold</option>
      </Select>

      <p className="text-sm text-muted-foreground">Slug final: {finalSlug || "-"}</p>

      <Button type="submit" variant="primary" className="w-full" disabled={isLoading || !finalSlug}>
        {isLoading ? "Criando..." : "Criar imovel"}
      </Button>

      {message ? (
        <p className={isError ? "text-sm text-red-500" : "text-sm text-green-600"}>{message}</p>
      ) : null}
    </form>
  );
}