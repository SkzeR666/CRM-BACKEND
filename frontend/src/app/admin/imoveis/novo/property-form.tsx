"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Link2, Trash2 } from "lucide-react";
import { createProject, deleteProject, getProjectById, updateProject } from "@/lib/api/projects";
import { getAdminAccessToken } from "@/lib/admin-auth";
import type { Project } from "@/types/project";
import { withTheme } from "@/lib/samfer-links";
import type { SamferTheme } from "@/lib/utils/theme";

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
  theme: SamferTheme;
};

export function PropertyFormLocal({ projectId, theme }: Props) {
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
        setMessage(loadError instanceof Error ? loadError.message : "Falha ao carregar imóvel.");
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
      if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

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
        setMessage("Imóvel atualizado com sucesso.");
      } else {
        await createProject(payload, { accessToken });
        setValues(initialValues);
        setMessage("Imóvel criado com sucesso.");
      }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Falha ao salvar imóvel.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!projectId) return;
    const confirmDelete = window.confirm("Excluir este imóvel?");
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const accessToken = await getAdminAccessToken();
      if (!accessToken) throw new Error("Sessão expirada. Faça login novamente.");

      await deleteProject(projectId, { accessToken });
      router.push(withTheme("/admin/imoveis", theme));
      router.refresh();
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Falha ao excluir imóvel.");
      setIsLoading(false);
    }
  }

  if (isLoadingProject) {
    return (
      <div className="admin-auth-loading">
        <p>Carregando dados do imóvel...</p>
      </div>
    );
  }

  return (
    <form className="admin-form samfer-animate" onSubmit={handleSubmit}>
      <section className="admin-form-summary samfer-animate">
        <p>
          <strong>Slug final:</strong> {finalSlug || "-"}
        </p>
        {isEditMode ? (
          <p>
            <strong>ID:</strong> {projectId}
          </p>
        ) : (
          <p>O slug é gerado automaticamente a partir do título quando vazio.</p>
        )}
      </section>

      <section className="admin-form-section samfer-animate">
        <h2>
          Informações <span>básicas</span>
        </h2>
        <p className="admin-section-text">Defina título, slug e status para aparecer corretamente na listagem pública.</p>
        <div className="admin-form-grid two-col">
          <label className="admin-field">
            <span className="samfer-sr-only">Título</span>
            <input
              name="title"
              placeholder="Título"
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

          <label className="admin-field is-span-2">
            <span className="samfer-sr-only">Descrição</span>
            <textarea
              name="description"
              placeholder="Descrição"
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

      <section className="admin-form-section samfer-animate">
        <h2>Localização</h2>
        <p className="admin-section-text">Esses dados alimentam filtros por cidade, bairro e estado no frontend.</p>
        <div className="admin-form-grid two-col">
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
          <label className="admin-field is-span-2">
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

      <section className="admin-form-section samfer-animate">
        <h2>Características</h2>
        <p className="admin-section-text">Preencha os números do imóvel para melhorar comparação e busca.</p>
        <div className="admin-form-grid two-col">
          <label className="admin-field">
            <span className="samfer-sr-only">Preço</span>
            <input
              name="price"
              placeholder="Preço"
              inputMode="decimal"
              value={values.price}
              onChange={(event) => setValues((prev) => ({ ...prev, price: event.target.value }))}
            />
          </label>
          <label className="admin-field">
            <span className="samfer-sr-only">Área m²</span>
            <input
              name="area_m2"
              placeholder="Área m²"
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
            <span className="samfer-sr-only">Suítes</span>
            <select
              name="suites"
              value={values.suites}
              onChange={(event) => setValues((prev) => ({ ...prev, suites: event.target.value }))}
            >
              <option value="">suítes</option>
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

      <section className="admin-form-section samfer-animate">
        <h2>Mídia</h2>
        <p className="admin-section-text">Use links diretos de imagem. Na galeria, um link por linha.</p>
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

      <section className="admin-form-section samfer-animate">
        <h2>Destaque</h2>
        <p className="admin-section-text">Marcar como destaque prioriza exibição em seções principais da landing.</p>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-select">
            <span className="samfer-sr-only">Imóvel em destaque</span>
            <select
              name="is_featured"
              value={values.is_featured}
              onChange={(event) => setValues((prev) => ({ ...prev, is_featured: event.target.value }))}
            >
              <option value="false">Imóvel em destaque?</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>
        </div>
      </section>

      <div className={`admin-form-actions is-sticky ${isEditMode ? "is-edit" : ""}`}>
        <button type="button" className="admin-secondary-btn is-large" onClick={() => router.push(withTheme("/admin/imoveis", theme))}>
          Voltar
        </button>
          <button type="submit" className="admin-primary-btn is-large" disabled={isLoading || !finalSlug}>
            {isLoading ? "Salvando..." : isEditMode ? "Salvar alterações" : "Salvar imóvel"}
        </button>
        {isEditMode ? (
          <button type="button" className="admin-danger-btn is-large" onClick={handleDelete} disabled={isLoading}>
            <Trash2 size={16} />
            Excluir imóvel
          </button>
        ) : null}
      </div>

      {message ? (
        <p className={`admin-feedback ${isError ? "is-error" : "is-success"}`}>{message}</p>
      ) : null}
    </form>
  );
}

