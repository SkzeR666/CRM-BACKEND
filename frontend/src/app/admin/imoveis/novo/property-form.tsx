"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Link2, Trash2 } from "lucide-react";
import { createProject, deleteProject, getProjectById, updateProject } from "@/lib/api/projects";
import { getAdminAccessToken } from "@/lib/admin-auth";
import type { Project } from "@/types/project";

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

function toNumberOrUndefined(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toIntegerOrUndefined(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
}

function normalizeText(value: string) {
  const normalized = value.trim();
  return normalized || undefined;
}

type FormValues = {
  title: string;
  slug: string;
  description: string;
  status: string;
  type: string;
  city: string;
  state: string;
  neighborhood: string;
  price: string;
  area_m2: string;
  bathrooms: string;
  bedrooms: string;
  parking_spots: string;
  suites: string;
  cover_image: string;
  gallery: string;
  is_featured: string;
};

const initialValues: FormValues = {
  title: "",
  slug: "",
  description: "",
  status: "available",
  type: "",
  city: "",
  state: "",
  neighborhood: "",
  price: "",
  area_m2: "",
  bathrooms: "",
  bedrooms: "",
  parking_spots: "",
  suites: "",
  cover_image: "",
  gallery: "",
  is_featured: "false",
};

const statusOptions = [
  { value: "available", label: "Ativo" },
  { value: "reserved", label: "Reservado" },
  { value: "sold", label: "Vendido" },
  { value: "draft", label: "Rascunho" },
];

const typeOptions = [
  { value: "", label: "tipo" },
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "studio", label: "Studio" },
  { value: "sobrado", label: "Sobrado" },
  { value: "terreno", label: "Terreno" },
];

const integerOptions = Array.from({ length: 9 }, (_, index) => {
  const value = String(index);
  return { value, label: value };
});

function projectToFormValues(project: Project): FormValues {
  return {
    title: project.title || "",
    slug: project.slug || "",
    description: project.description || "",
    status: String(project.status || "available"),
    type: project.type || "",
    city: project.city || "",
    state: project.state || "",
    neighborhood: project.neighborhood || "",
    price: typeof project.price === "number" ? String(project.price) : "",
    area_m2: typeof project.area_m2 === "number" ? String(project.area_m2) : "",
    bathrooms: typeof project.bathrooms === "number" ? String(project.bathrooms) : "",
    bedrooms: typeof project.bedrooms === "number" ? String(project.bedrooms) : "",
    parking_spots: typeof project.parking_spots === "number" ? String(project.parking_spots) : "",
    suites: typeof project.suites === "number" ? String(project.suites) : "",
    cover_image: project.cover_image || "",
    gallery: Array.isArray(project.gallery) ? project.gallery.join("\n") : "",
    is_featured: project.is_featured ? "true" : "false",
  };
}

type Props = {
  projectId?: string;
};

export function PropertyFormLocal({ projectId }: Props) {
  const router = useRouter();
  const isEditMode = Boolean(projectId);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(isEditMode);

  const finalSlug = useMemo(
    () => (values.slug ? slugify(values.slug) : slugify(values.title)),
    [values.slug, values.title],
  );

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    setIsLoadingProject(true);
    getProjectById(projectId)
      .then((project) => {
        if (!project || cancelled) return;
        setValues(projectToFormValues(project));
      })
      .catch((loadError) => {
        if (cancelled) return;
        setIsError(true);
        setMessage(loadError instanceof Error ? loadError.message : "Falha ao carregar imovel.");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingProject(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessao expirada. Faca login novamente.");

      const gallery = values.gallery
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        slug: finalSlug,
        title: values.title.trim(),
        description: normalizeText(values.description),
        city: normalizeText(values.city),
        state: normalizeText(values.state),
        neighborhood: normalizeText(values.neighborhood),
        type: normalizeText(values.type),
        status: normalizeText(values.status),
        price: toNumberOrUndefined(values.price),
        area_m2: toNumberOrUndefined(values.area_m2),
        bathrooms: toIntegerOrUndefined(values.bathrooms),
        bedrooms: toIntegerOrUndefined(values.bedrooms),
        parking_spots: toIntegerOrUndefined(values.parking_spots),
        suites: toIntegerOrUndefined(values.suites),
        cover_image: normalizeText(values.cover_image),
        gallery: gallery.length ? gallery : undefined,
        is_featured: values.is_featured === "true",
      };

      if (projectId) {
        await updateProject(projectId, payload, { accessToken });
        setMessage("Imovel atualizado com sucesso.");
      } else {
        await createProject(payload, { accessToken });
        setValues(initialValues);
        setMessage("Imovel criado com sucesso.");
      }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Falha ao salvar imovel.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!projectId) return;
    const confirmDelete = window.confirm("Excluir este imovel?");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessao expirada. Faca login novamente.");

      await deleteProject(projectId, { accessToken });
      router.push("/admin/imoveis");
      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Falha ao excluir imovel.");
      setIsLoading(false);
    }
  }

  if (isLoadingProject) {
    return (
      <div className="admin-auth-loading">
        <p>Carregando dados do imovel...</p>
      </div>
    );
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <section className="admin-form-section">
        <h2>
          Informacoes <span>basicas</span>
        </h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="samfer-sr-only">Titulo</span>
            <input
              name="title"
              placeholder="titulo"
              value={values.title}
              onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </label>

          <label className="admin-field">
            <span className="samfer-sr-only">Slug</span>
            <input
              name="slug"
              placeholder="slug"
              value={values.slug}
              onChange={(event) => setValues((prev) => ({ ...prev, slug: event.target.value }))}
            />
          </label>

          <label className="admin-field">
            <span className="samfer-sr-only">Descricao</span>
            <textarea
              name="description"
              placeholder="descricao"
              rows={1}
              value={values.description}
              onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>

          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Status</span>
            <select
              name="status"
              value={values.status}
              onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="">status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>

          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Tipo</span>
            <select
              name="type"
              value={values.type}
              onChange={(event) => setValues((prev) => ({ ...prev, type: event.target.value }))}
            >
              {typeOptions.map((option) => (
                <option key={option.value || "empty"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Localizacao</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="samfer-sr-only">Cidade</span>
            <input
              name="city"
              placeholder="cidade"
              value={values.city}
              onChange={(event) => setValues((prev) => ({ ...prev, city: event.target.value }))}
            />
          </label>
          <label className="admin-field">
            <span className="samfer-sr-only">Estado</span>
            <input
              name="state"
              placeholder="estado"
              value={values.state}
              onChange={(event) => setValues((prev) => ({ ...prev, state: event.target.value }))}
            />
          </label>
          <label className="admin-field">
            <span className="samfer-sr-only">Bairro</span>
            <input
              name="neighborhood"
              placeholder="bairro"
              value={values.neighborhood}
              onChange={(event) => setValues((prev) => ({ ...prev, neighborhood: event.target.value }))}
            />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Caracteristicas</h2>
        <div className="admin-form-grid two-col">
          <label className="admin-field">
            <span className="samfer-sr-only">Preco</span>
            <input
              name="price"
              placeholder="preco"
              inputMode="decimal"
              value={values.price}
              onChange={(event) => setValues((prev) => ({ ...prev, price: event.target.value }))}
            />
          </label>
          <label className="admin-field">
            <span className="samfer-sr-only">Area m2</span>
            <input
              name="area_m2"
              placeholder="area m2"
              inputMode="decimal"
              value={values.area_m2}
              onChange={(event) => setValues((prev) => ({ ...prev, area_m2: event.target.value }))}
            />
          </label>

          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Banheiros</span>
            <select
              name="bathrooms"
              value={values.bathrooms}
              onChange={(event) => setValues((prev) => ({ ...prev, bathrooms: event.target.value }))}
            >
              <option value="">banheiros</option>
              {integerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>

          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Quartos</span>
            <select
              name="bedrooms"
              value={values.bedrooms}
              onChange={(event) => setValues((prev) => ({ ...prev, bedrooms: event.target.value }))}
            >
              <option value="">quartos</option>
              {integerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>

          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Vagas</span>
            <select
              name="parking_spots"
              value={values.parking_spots}
              onChange={(event) => setValues((prev) => ({ ...prev, parking_spots: event.target.value }))}
            >
              <option value="">vagas</option>
              {integerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>

          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Suites</span>
            <select
              name="suites"
              value={values.suites}
              onChange={(event) => setValues((prev) => ({ ...prev, suites: event.target.value }))}
            >
              <option value="">suites</option>
              {integerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Midia</h2>
        <div className="admin-form-grid two-col">
          <label className="admin-field admin-field-with-icon">
            <span className="samfer-sr-only">Foto de capa</span>
            <input
              name="cover_image"
              placeholder="foto de capa"
              value={values.cover_image}
              onChange={(event) => setValues((prev) => ({ ...prev, cover_image: event.target.value }))}
            />
            <Link2 size={16} aria-hidden />
          </label>

          <label className="admin-field admin-field-with-icon">
            <span className="samfer-sr-only">Galeria</span>
            <textarea
              name="gallery"
              placeholder="galeria (cole um link por linha)"
              rows={1}
              value={values.gallery}
              onChange={(event) => setValues((prev) => ({ ...prev, gallery: event.target.value }))}
            />
            <Link2 size={16} aria-hidden />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Destaque</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Imovel em destaque</span>
            <select
              name="is_featured"
              value={values.is_featured}
              onChange={(event) => setValues((prev) => ({ ...prev, is_featured: event.target.value }))}
            >
              <option value="false">imovel em destaque?</option>
              <option value="true">sim</option>
              <option value="false">nao</option>
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>
        </div>
      </section>

      <div className={`admin-form-actions ${isEditMode ? "is-edit" : ""}`}>
        <button type="button" className="admin-secondary-btn is-large" onClick={() => router.push("/admin/imoveis")}>
          Voltar
        </button>
        <button type="submit" className="admin-primary-btn is-large" disabled={isLoading || !finalSlug}>
          {isLoading ? "Salvando..." : isEditMode ? "Salvar alteracoes" : "Salvar imovel"}
        </button>
        {isEditMode ? (
          <button type="button" className="admin-danger-btn is-large" onClick={handleDelete} disabled={isLoading}>
            <Trash2 size={16} />
            Excluir imovel
          </button>
        ) : null}
      </div>

      <p className="admin-feedback">Slug final: {finalSlug || "-"}</p>
      {message ? (
        <p className={`admin-feedback ${isError ? "is-error" : "is-success"}`}>{message}</p>
      ) : null}
    </form>
  );
}
