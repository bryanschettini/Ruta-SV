import Link from "next/link";
import { Suspense } from "react";
import ClimaCapital, { ClimaCapitalCargando } from "@/components/ClimaCapital";
import DestinoCard from "@/components/DestinoCard";
import { CATEGORIAS, DESTINOS } from "@/lib/destinos";
import type { Categoria } from "@/lib/types";

export default function Inicio() {
  const destacados = DESTINOS.filter((d) => d.destacado);
  const conteo = (c: Categoria) => DESTINOS.filter((d) => d.categoria === c).length;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-700 to-ocean-500 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sunset-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-sunset-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-sm">🇸🇻 Guía de viaje · El Salvador</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Del volcán al mar
              <br />
              <span className="text-sunset-400">en una sola ruta.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Descubre {DESTINOS.length} destinos entre playas, volcanes y pueblos coloniales, revisa el clima en
              tiempo real y arma tu itinerario con presupuesto estimado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/destinos" className="rounded-full bg-sunset-500 px-6 py-3 font-medium shadow-lg hover:bg-sunset-600">
                Explorar destinos
              </Link>
              <Link href="/planificador" className="rounded-full border border-white/40 px-6 py-3 font-medium hover:bg-white/10">
                Ver mi plan
              </Link>
            </div>
            <div className="mt-8">
              <Suspense fallback={<ClimaCapitalCargando />}>
                <ClimaCapital />
              </Suspense>
            </div>
          </div>
          <div className="hidden grid-cols-2 gap-3 self-center md:grid" aria-hidden>
            {["🌋", "🏄", "🌸", "🏺"].map((e, i) => (
              <div
                key={e}
                className={`grid aspect-square place-items-center rounded-3xl bg-white/10 text-6xl backdrop-blur ${i % 2 ? "translate-y-6" : ""}`}
              >
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">¿Qué tipo de viaje buscas?</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
            <li key={c}>
              <Link
                href={`/destinos?categoria=${c}`}
                className={`flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br ${CATEGORIAS[c].color} p-4 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
              >
                <span className="text-3xl" aria-hidden>{CATEGORIAS[c].emoji}</span>
                <span className="mt-6">
                  <span className="block font-semibold">{CATEGORIAS[c].nombre}</span>
                  <span className="text-sm text-white/85">{conteo(c)} destinos</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Imperdibles</h2>
          <Link href="/destinos" className="shrink-0 text-sm font-medium text-ocean-700 hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((d) => (
            <DestinoCard key={d.slug} destino={d} />
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-y border-border bg-card">
        <ol className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            ["1", "Explora", "Filtra por tipo de viaje, departamento o busca por actividad."],
            ["2", "Consulta el clima", "Pronóstico de 4 días para cada destino con datos de Open-Meteo."],
            ["3", "Arma tu plan", "Agrega destinos, ajusta los días y obtén un presupuesto estimado."],
          ].map(([n, titulo, texto]) => (
            <li key={n} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ocean-100 font-bold text-ocean-700">{n}</span>
              <div>
                <h3 className="font-semibold">{titulo}</h3>
                <p className="mt-1 text-sm text-muted">{texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
