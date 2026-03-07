"use client";

import { useMemo, useState } from "react";
import { slugify } from "@/lib/slug";

type PropertyFormValues = {
  title: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  neighborhood: string;
  type: string;
  price: string;
  bedrooms: string;
  suites: string;
  parking_spots: string;
  bathrooms: string;
  area_m2: string;
  cover_image: string;
  gallery_text: string;
  is_featured: boolean;
  status: string;
};

const initialValues: PropertyFormValues = {
  title: "",
  slug: "",
  description: "",
  city: "",
  state: "",
  neighborhood: "",
  type: "apartamento",
  price: "",
  bedrooms: "0",
  suites: "0",
  parking_spots: "0",
  bathrooms: "0",
  area_m2: "",
  cover_image: "",
  gallery_text: "",
  is_featured: false,
  status: "available",
};

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="label-md text-primary">{label}</label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-[10px] border border-subtle bg-surface px-4 py-4 outline-none transition-colors focus:border-[var(--primary)]";

export function PropertyForm() {
  const [values, setValues] = useState<PropertyFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const parsedGallery = useMemo(
    () =>
      values.gallery_text
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [values.gallery_text]
  );

  function update<K extends keyof PropertyFormValues>(
    key: K,
    value: PropertyFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setValues((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug ? prev.slug : slugify(value),
    }));
  }

  function handleSlugChange(value: string) {
    setValues((prev) => ({
      ...prev,
      slug: slugify(value),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          slug: values.slug || slugify(values.title),
          gallery: parsedGallery,
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao salvar imóvel");
      }

      setMessage("Imóvel cadastrado com sucesso.");
      setMessageType("success");
      setValues(initialValues);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Título">
          <input
            value={values.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex: Residencial Vista Verde"
            className={inputClassName}
          />
        </Field>

        <Field label="Slug">
          <input
            value={values.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="Ex: residencial-vista-verde"
            className={inputClassName}
          />
        </Field>

        <Field label="Cidade">
          <input
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Ex: Taubaté"
            className={inputClassName}
          />
        </Field>

        <Field label="Estado">
          <input
            value={values.state}
            onChange={(e) => update("state", e.target.value)}
            placeholder="Ex: SP"
            className={inputClassName}
          />
        </Field>

        <Field label="Bairro">
          <input
            value={values.neighborhood}
            onChange={(e) => update("neighborhood", e.target.value)}
            placeholder="Ex: Jardim das Nações"
            className={inputClassName}
          />
        </Field>

        <Field label="Tipo">
          <select
            value={values.type}
            onChange={(e) => update("type", e.target.value)}
            className={inputClassName}
          >
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="cobertura">Cobertura</option>
          </select>
        </Field>

        <Field label="Preço">
          <input
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="Ex: 550000"
            className={inputClassName}
            inputMode="numeric"
          />
        </Field>

        <Field label="Área m²">
          <input
            value={values.area_m2}
            onChange={(e) => update("area_m2", e.target.value)}
            placeholder="Ex: 120"
            className={inputClassName}
            inputMode="decimal"
          />
        </Field>

        <Field label="Quartos">
          <input
            value={values.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            placeholder="0"
            className={inputClassName}
            inputMode="numeric"
          />
        </Field>

        <Field label="Suítes">
          <input
            value={values.suites}
            onChange={(e) => update("suites", e.target.value)}
            placeholder="0"
            className={inputClassName}
            inputMode="numeric"
          />
        </Field>

        <Field label="Vagas">
          <input
            value={values.parking_spots}
            onChange={(e) => update("parking_spots", e.target.value)}
            placeholder="0"
            className={inputClassName}
            inputMode="numeric"
          />
        </Field>

        <Field label="Banheiros">
          <input
            value={values.bathrooms}
            onChange={(e) => update("bathrooms", e.target.value)}
            placeholder="0"
            className={inputClassName}
            inputMode="numeric"
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Imagem de capa">
            <input
              value={values.cover_image}
              onChange={(e) => update("cover_image", e.target.value)}
              placeholder="https://..."
              className={inputClassName}
            />
          </Field>
        </div>

        <Field label="Status">
          <select
            value={values.status}
            onChange={(e) => update("status", e.target.value)}
            className={inputClassName}
          >
            <option value="available">Disponível</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
          </select>
        </Field>

        <Field label="Destaque">
          <label className="flex h-[56px] items-center gap-3 rounded-[10px] border border-subtle bg-surface px-4">
            <input
              type="checkbox"
              checked={values.is_featured}
              onChange={(e) => update("is_featured", e.target.checked)}
            />
            <span className="body-sm text-primary">Destacar imóvel</span>
          </label>
        </Field>
      </div>

      <Field label="Descrição">
        <textarea
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Descreva o imóvel, localização, diferenciais e proposta de valor."
          rows={5}
          className={inputClassName}
        />
      </Field>

      <Field label="Galeria">
        <textarea
          value={values.gallery_text}
          onChange={(e) => update("gallery_text", e.target.value)}
          placeholder={"Uma URL por linha\nhttps://...\nhttps://..."}
          rows={5}
          className={inputClassName}
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[10px] bg-primary px-6 py-4 text-on-primary disabled:opacity-70"
        >
          {isSubmitting ? "Salvando..." : "Salvar imóvel"}
        </button>

        {message ? (
          <p
            className={`body-sm ${
              messageType === "success" ? "text-primary" : "text-secondary"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}