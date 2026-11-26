"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIAS } from "@/lib/destinos";
import { guardarPlan, leerPlan } from "@/lib/plan";
import type { ApiError, Destino, ItemPlan } from "@/lib/types";

export default function Planificador() {
  const [plan, setPlan] = useState<ItemPlan[] | null>(null);
  const [catalogo, setCatalogo] = useState<Record<string, Destino> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viajeros, setViajeros] = useState(2);
  const [copiado, setCopiado] = useState(false);
  const [intento, setIntento] = useState(0);

  // 1) Cargar el plan guardado y escuchar cambios desde otras pestañas/componentes
  useEffect(() => {
    const sincronizar = () => setPlan(leerPlan());
    const id = requestAnimationFrame(sincronizar);
    window.addEventListener("storage", sincronizar);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  // 2) Obtener los datos de los destinos desde la API interna
  useEffect(() => {
    const controlador = new AbortController();
    fetch("/api/destinos", { signal: controlador.signal })
      .then(async (res) => {
        const json = (await res.json()) as { destinos: Destino[] } | ApiError;
        if (!res.ok || "error" in json) throw new Error("error" in json ? json.error : `Error ${res.status}`);
        setCatalogo(Object.fromEntries(json.destinos.map((d) => [d.slug, d])));
        setError(null);
      })
      .catch((err: unknown) => {
        if (!controlador.signal.aborted) setError(err instanceof Error ? err.message : "Error desconocido");
      });
    return () => controlador.abort();
  }, [intento]);

  // Guarda cada cambio local en localStorage
  const actualizar = (nuevo: ItemPlan[]) => {
    setPlan(nuevo);
    guardarPlan(nuevo);
  };

  // Une el plan con el catálogo y calcula el día de inicio de cada parada
  const items = useMemo(() => {
    if (!plan || !catalogo) return [];
    const validos = plan.filter((i) => catalogo[i.slug]);
    return validos.map((i, idx) => ({
      ...i,
      destino: catalogo[i.slug],
      inicio: 1 + validos.slice(0, idx).reduce((s, x) => s + x.dias, 0),
    }));
  }, [plan, catalogo]);

  const totalDias = items.reduce((s, i) => s + i.dias, 0);
  const totalUSD = items.reduce((s, i) => s + i.dias * i.destino.gastoDiarioUSD, 0) * viajeros;

  const cambiarDias = (slug: string, delta: number) =>
    actualizar(plan!.map((i) => (i.slug === slug ? { ...i, dias: Math.min(14, Math.max(1, i.dias + delta)) } : i)));
  const cambiarNota = (slug: string, nota: string) =>
    actualizar(plan!.map((i) => (i.slug === slug ? { ...i, nota } : i)));
  const quitar = (slug: string) => actualizar(plan!.filter((i) => i.slug !== slug));
  const mover = (indice: number, delta: number) => {
    const copia = [...plan!];
    const destino = indice + delta;
    if (destino < 0 || destino >= copia.length) return;
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    actualizar(copia);
  };

  const copiarResumen = async () => {
    const lineas = items.map((i) => {
      const rango = i.dias === 1 ? `Día ${i.inicio}` : `Días ${i.inicio}-${i.inicio + i.dias - 1}`;
      return `${rango}: ${i.destino.nombre} (${i.destino.departamento})${i.nota ? ` — ${i.nota}` : ""}`;
    });
    const texto = [
      "Mi ruta por El Salvador 🇸🇻",
      ...lineas,
      `Total: ${totalDias} días · ${viajeros} viajero(s) · ~$${totalUSD} USD`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  };

  if (error && !catalogo) {
    return (
      <div role="alert" className="rounded-2xl border border-sunset-400 bg-sunset-100 p-6 text-center">
        <p className="font-semibold text-sunset-600">No pudimos cargar tu plan</p>
        <p className="mt-1 text-sm text-muted">{error}</p>
        <button onClick={() => setIntento((n) => n + 1)} className="mt-4 rounded-full bg-sunset-500 px-5 py-2 font-medium text-white">
          Reintentar
        </button>
      </div>
    );
  }

  if (plan === null || catalogo === null) {
    return (
      <div className="space-y-3" role="status">
        <span className="sr-only">Cargando plan…</span>
        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    );
  }

  if (items.length === 0) {
    const sugerencias = Object.values(catalogo).filter((d) => d.destacado).slice(0, 3);
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center sm:p-12">
        <p className="text-5xl" aria-hidden>🗺️</p>
        <h2 className="mt-3 text-xl font-semibold">Tu plan está vacío</h2>
        <p className="mt-1 text-muted">Agrega destinos desde su página de detalle para armar tu ruta.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {sugerencias.map((d) => (
            <Link key={d.slug} href={`/destinos/${d.slug}`} className="rounded-full bg-ocean-50 px-4 py-2 text-sm font-medium text-ocean-700 hover:bg-ocean-100">
              {d.emoji} {d.nombre}
            </Link>
          ))}
        </div>
        <Link href="/destinos" className="mt-6 inline-block rounded-full bg-sunset-500 px-6 py-2.5 font-medium text-white hover:bg-sunset-600">
          Explorar destinos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ol className="space-y-4">
        {items.map((item, indice) => {
          const { inicio } = item;
          return (
            <li key={item.slug} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex gap-4">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${CATEGORIAS[item.destino.categoria].color} text-2xl`} aria-hidden>
                  {item.destino.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ocean-700">
                    {item.dias === 1 ? `Día ${inicio}` : `Días ${inicio}–${inicio + item.dias - 1}`}
                  </p>
                  <Link href={`/destinos/${item.slug}`} className="block truncate font-semibold hover:text-ocean-700">
                    {item.destino.nombre}
                  </Link>
                  <p className="text-sm text-muted">{item.destino.departamento} · ~${item.destino.gastoDiarioUSD}/día</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => mover(indice, -1)} disabled={indice === 0} aria-label="Subir" className="rounded-md border border-border px-2 text-sm disabled:opacity-30">↑</button>
                  <button onClick={() => mover(indice, 1)} disabled={indice === items.length - 1} aria-label="Bajar" className="rounded-md border border-border px-2 text-sm disabled:opacity-30">↓</button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2" role="group" aria-label={`Días en ${item.destino.nombre}`}>
                  <button onClick={() => cambiarDias(item.slug, -1)} className="h-9 w-9 rounded-full border border-border font-semibold hover:bg-stone-100" aria-label="Menos días">−</button>
                  <span className="w-16 text-center font-medium">{item.dias} {item.dias === 1 ? "día" : "días"}</span>
                  <button onClick={() => cambiarDias(item.slug, 1)} className="h-9 w-9 rounded-full border border-border font-semibold hover:bg-stone-100" aria-label="Más días">+</button>
                </div>
                <input
                  value={item.nota}
                  onChange={(e) => cambiarNota(item.slug, e.target.value)}
                  placeholder="Nota (hotel, transporte…)"
                  aria-label={`Nota para ${item.destino.nombre}`}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ocean-500"
                />
                <button onClick={() => quitar(item.slug)} className="text-sm font-medium text-sunset-600 hover:underline">Quitar</button>
              </div>
            </li>
          );
        })}
      </ol>

      <aside className="h-fit rounded-2xl bg-volcano-800 p-6 text-white lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <label className="mt-4 block text-sm text-stone-300">
          Viajeros
          <input
            type="number"
            min={1}
            max={20}
            value={viajeros}
            onChange={(e) => setViajeros(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sunset-400"
          />
        </label>
        <dl className="mt-5 space-y-3">
          <div className="flex justify-between"><dt className="text-stone-300">Destinos</dt><dd className="font-semibold">{items.length}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-300">Duración</dt><dd className="font-semibold">{totalDias} días</dd></div>
          <div className="flex justify-between border-t border-white/15 pt-3">
            <dt className="text-stone-300">Presupuesto estimado</dt>
            <dd className="text-2xl font-bold text-sunset-400">${totalUSD.toLocaleString("es-SV")}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-stone-400">Estimación referencial de hospedaje, comida y entradas. No incluye vuelos.</p>
        <button onClick={copiarResumen} className="mt-5 w-full rounded-full bg-sunset-500 py-2.5 font-medium hover:bg-sunset-600">
          {copiado ? "¡Copiado! ✓" : "Copiar itinerario"}
        </button>
        <button onClick={() => actualizar([])} className="mt-2 w-full rounded-full border border-white/25 py-2.5 text-sm hover:bg-white/10">
          Vaciar plan
        </button>
      </aside>
    </div>
  );
}
