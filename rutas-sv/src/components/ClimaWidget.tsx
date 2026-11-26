"use client";

import { useEffect, useState } from "react";
import type { ApiError, Clima } from "@/lib/types";

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error"; mensaje: string }
  | { tipo: "listo"; clima: Clima };

const formatoDia = new Intl.DateTimeFormat("es-SV", { weekday: "short", day: "numeric", timeZone: "UTC" });

/**
 * Client Component: consulta /api/clima desde el navegador con useEffect
 * y gestiona sus propios estados de carga y error.
 */
export default function ClimaWidget({ lat, lon, lugar }: { lat: number; lon: number; lugar: string }) {
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    fetch(`/api/clima?lat=${lat}&lon=${lon}`, { signal: controlador.signal })
      .then(async (res) => {
        const datos = (await res.json()) as Clima | ApiError;
        if (!res.ok || "error" in datos) {
          throw new Error("error" in datos ? datos.error : `Error ${res.status}`);
        }
        setEstado({ tipo: "listo", clima: datos });
      })
      .catch((err: unknown) => {
        if (controlador.signal.aborted) return;
        setEstado({ tipo: "error", mensaje: err instanceof Error ? err.message : "Error desconocido" });
      });

    return () => controlador.abort();
  }, [lat, lon, intento]);

  const reintentar = () => {
    setEstado({ tipo: "cargando" });
    setIntento((n) => n + 1);
  };

  return (
    <section aria-labelledby="titulo-clima" aria-busy={estado.tipo === "cargando"} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 id="titulo-clima" className="text-sm font-semibold uppercase tracking-wide text-muted">
        Clima en {lugar}
      </h2>

      {estado.tipo === "cargando" && (
        <div className="mt-4 space-y-3" role="status">
          <span className="sr-only">Cargando clima…</span>
          <div className="skeleton h-12 w-2/3 rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {estado.tipo === "error" && (
        <div className="mt-4 rounded-xl bg-sunset-100 p-4 text-sm" role="alert">
          <p className="font-medium text-sunset-600">No pudimos cargar el clima.</p>
          <p className="mt-1 text-muted">{estado.mensaje}</p>
          <button
            onClick={reintentar}
            className="mt-3 rounded-full bg-sunset-500 px-4 py-1.5 font-medium text-white hover:bg-sunset-600"
          >
            Reintentar
          </button>
        </div>
      )}

      {estado.tipo === "listo" && (
        <div className="mt-3">
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden>{estado.clima.actual.icono}</span>
            <div>
              <p className="text-4xl font-semibold">{Math.round(estado.clima.actual.temperatura)}°C</p>
              <p className="text-sm text-muted">{estado.clima.actual.descripcion}</p>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-ocean-50 p-2">
              <dt className="text-muted">Sensación</dt>
              <dd className="font-semibold">{Math.round(estado.clima.actual.sensacion)}°</dd>
            </div>
            <div className="rounded-lg bg-ocean-50 p-2">
              <dt className="text-muted">Humedad</dt>
              <dd className="font-semibold">{estado.clima.actual.humedad}%</dd>
            </div>
            <div className="rounded-lg bg-ocean-50 p-2">
              <dt className="text-muted">Viento</dt>
              <dd className="font-semibold">{Math.round(estado.clima.actual.viento)} km/h</dd>
            </div>
          </dl>
          <ul className="mt-4 grid grid-cols-4 gap-2">
            {estado.clima.dias.map((d) => (
              <li key={d.fecha} className="rounded-lg border border-border p-2 text-center text-xs">
                <p className="capitalize text-muted">{formatoDia.format(new Date(`${d.fecha}T12:00:00Z`))}</p>
                <p className="my-1 text-xl" title={d.descripcion}>{d.icono}</p>
                <p className="font-semibold">{Math.round(d.max)}° <span className="font-normal text-muted">{Math.round(d.min)}°</span></p>
                <p className="text-ocean-700">💧 {d.probLluvia}%</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            Fuente: {estado.clima.fuente === "simulado" ? "datos simulados (WEATHER_MOCK)" : "Open-Meteo"}
          </p>
        </div>
      )}
    </section>
  );
}
