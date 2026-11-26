"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DestinoCard from "@/components/DestinoCard";
import { CATEGORIAS } from "@/lib/destinos";
import type { ApiError, Categoria, Destino } from "@/lib/types";

interface RespuestaDestinos {
  total: number;
  departamentos: string[];
  destinos: Destino[];
}

/**
 * Client Component: los filtros viven en el estado (useState) y en la URL;
 * cada cambio dispara una petición a /api/destinos (useEffect) con debounce.
 */
export default function ExploradorDestinos() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [categoria, setCategoria] = useState(params.get("categoria") ?? "");
  const [departamento, setDepartamento] = useState(params.get("departamento") ?? "");

  const [datos, setDatos] = useState<RespuestaDestinos | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const query = new URLSearchParams();
    if (q.trim()) query.set("q", q.trim());
    if (categoria) query.set("categoria", categoria);
    if (departamento) query.set("departamento", departamento);
    const qs = query.toString();

    // Debounce: espera a que el usuario deje de escribir
    const timer = setTimeout(async () => {
      setCargando(true);
      setError(null);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      try {
        const res = await fetch(`/api/destinos${qs ? `?${qs}` : ""}`, { signal: controlador.signal });
        const json = (await res.json()) as RespuestaDestinos | ApiError;
        if (!res.ok || "error" in json) throw new Error("error" in json ? json.error : `Error ${res.status}`);
        setDatos(json);
      } catch (err) {
        if (controlador.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controlador.abort();
    };
  }, [q, categoria, departamento, intento, pathname, router]);

  const limpiar = () => {
    setQ("");
    setCategoria("");
    setDepartamento("");
  };

  const hayFiltros = Boolean(q || categoria || departamento);

  return (
    <div>
      {/* Filtros */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="block">
            <span className="sr-only">Buscar destinos</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busca por nombre o actividad: surf, café, cráter…"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100"
            />
          </label>
          <label className="block">
            <span className="sr-only">Departamento</span>
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100"
            >
              <option value="">Todos los departamentos</option>
              {datos?.departamentos.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          <button
            onClick={() => setCategoria("")}
            aria-pressed={categoria === ""}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              categoria === "" ? "bg-foreground text-white" : "bg-stone-100 hover:bg-stone-200"
            }`}
          >
            Todas
          </button>
          {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c === categoria ? "" : c)}
              aria-pressed={categoria === c}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                categoria === c ? "bg-ocean-600 text-white" : "bg-stone-100 hover:bg-stone-200"
              }`}
            >
              {CATEGORIAS[c].emoji} {CATEGORIAS[c].nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-6 flex items-center justify-between text-sm text-muted" aria-live="polite">
        <span>{cargando ? "Buscando…" : datos ? `${datos.total} destino${datos.total === 1 ? "" : "s"}` : ""}</span>
        {hayFiltros && (
          <button onClick={limpiar} className="font-medium text-ocean-700 hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {error ? (
        <div role="alert" className="mt-4 rounded-2xl border border-sunset-400 bg-sunset-100 p-6 text-center">
          <p className="font-semibold text-sunset-600">No se pudieron cargar los destinos</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <button
            onClick={() => setIntento((n) => n + 1)}
            className="mt-4 rounded-full bg-sunset-500 px-5 py-2 font-medium text-white hover:bg-sunset-600"
          >
            Reintentar
          </button>
        </div>
      ) : cargando && !datos ? (
        <GridEsqueleto />
      ) : datos && datos.destinos.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-4xl" aria-hidden>🧭</p>
          <p className="mt-2 font-semibold">Sin resultados</p>
          <p className="text-sm text-muted">Prueba con otra palabra o quita algún filtro.</p>
        </div>
      ) : (
        <div className={`mt-4 grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${cargando ? "opacity-60" : ""}`}>
          {datos?.destinos.map((d) => (
            <DestinoCard key={d.slug} destino={d} />
          ))}
        </div>
      )}
    </div>
  );
}

export function GridEsqueleto({ n = 6 }: { n?: number }) {
  return (
    <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status">
      <span className="sr-only">Cargando destinos…</span>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="skeleton h-36" />
          <div className="space-y-2 p-5">
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
