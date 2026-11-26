import { connection } from "next/server";
import { obtenerClima } from "@/lib/clima";

/**
 * Server Component asíncrono: consulta la API de clima directamente desde
 * el servidor (sin pasar por el navegador). Se renderiza dentro de <Suspense>
 * para que el resto de la página se muestre de inmediato.
 */
export default async function ClimaCapital() {
  // Marca este componente como dinámico: el clima se consulta en cada petición
  await connection();

  // El try/catch solo envuelve la obtención de datos; el JSX se construye fuera
  // (regla react-hooks/error-boundaries: try/catch no captura errores de render)
  const clima = await obtenerClima(13.6989, -89.1914).catch(() => null);

  if (!clima) {
    return (
      <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm text-white/90 backdrop-blur">
        🌡️ Clima de San Salvador no disponible por ahora.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-white backdrop-blur">
      <span className="text-3xl" aria-hidden>{clima.actual.icono}</span>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-wide text-white/80">Ahora en San Salvador</p>
        <p className="font-semibold">
          {Math.round(clima.actual.temperatura)}°C · {clima.actual.descripcion}
        </p>
      </div>
    </div>
  );
}

export function ClimaCapitalCargando() {
  return (
    <div className="flex h-[60px] w-60 items-center gap-3 rounded-2xl bg-white/15 px-4" role="status">
      <span className="sr-only">Cargando clima…</span>
      <div className="h-8 w-8 animate-pulse rounded-full bg-white/30" />
      <div className="h-4 flex-1 animate-pulse rounded bg-white/30" />
    </div>
  );
}
