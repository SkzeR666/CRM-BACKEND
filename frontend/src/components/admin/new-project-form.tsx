"use client";

import { FormEvent, useMemo, useState } from "react";
import { createProject } from "@/lib/api/projects";
import { slugify } from "@/lib/slug";
import type { ProjectStatus } from "@/types/project";

const ADMIN_KEY_STORAGE = "crm_admin_api_key";

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

export function NewProjectForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const resolvedSlug = useMemo(
    () => (values.slug ? slugify(values.slug) : slugify(values.title)),
    [values.slug, values.title]
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const adminKey = window.localStorage.getItem(ADMIN_KEY_STORAGE) ?? undefined;

      await createProject(
        {
          title: values.title,
          slug: resolvedSlug,
          city: values.city || undefined,
          status: values.status,
        },
        { adminKey }
      );

      setValues(initialValues);
      setMessage("Projeto criado com sucesso.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Falha ao criar projeto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label className="label" htmlFor="title">
        Titulo
      </label>
      <input
        id="title"
        className="input"
        value={values.title}
        onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
        placeholder="Residencial Aurora"
        required
      />

      <label className="label" htmlFor="slug">
        Slug
      </label>
      <input
        id="slug"
        className="input"
        value={values.slug}
        onChange={(event) => setValues((prev) => ({ ...prev, slug: event.target.value }))}
        placeholder="residencial-aurora"
      />
      <p className="muted">Slug final: {resolvedSlug || "-"}</p>

      <label className="label" htmlFor="city">
        Cidade
      </label>
      <input
        id="city"
        className="input"
        value={values.city}
        onChange={(event) => setValues((prev) => ({ ...prev, city: event.target.value }))}
        placeholder="Taubate"
      />

      <label className="label" htmlFor="status">
        Status
      </label>
      <select
        id="status"
        className="input"
        value={values.status}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, status: event.target.value as ProjectStatus }))
        }
      >
        <option value="available">available</option>
        <option value="reserved">reserved</option>
        <option value="sold">sold</option>
      </select>

      <button className="button" type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Criar projeto"}
      </button>

      {message ? <p className={isError ? "error" : "success"}>{message}</p> : null}
    </form>
  );
}
