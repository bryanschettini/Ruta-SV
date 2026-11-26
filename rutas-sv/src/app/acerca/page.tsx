import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca del proyecto",
  description: "Cómo se construyó Rutas SV con Next.js 16 y Vibe Coding.",
};

const STACK = [
  ["Next.js 16", "App Router, Route Handlers, Cache Components"],
  ["TypeScript", "Tipado estricto de datos y respuestas de API"],
  ["Tailwind CSS 4", "Diseño responsive mobile-first"],
  ["Open-Meteo", "API externa de clima, consumida desde el servidor"],
  ["Vercel", "Despliegue continuo desde GitHub"],
  ["IA como copiloto", "Generación iterativa, revisión y corrección de código"],
];

const RUTAS = [
  ["/", "Inicio", "Server Component + Suspense (clima en vivo)"],
  ["/destinos", "Explorador", "Client Component con useState/useEffect"],
  ["/destinos/[slug]", "Detalle", "Server Component con generateStaticParams"],
  ["/planificador", "Mi plan", "Client Component con localStorage"],
  ["/acerca", "Acerca", "Server Component estático"],
  ["/api/destinos", "API", "Route Handler con filtros"],
  ["/api/destinos/[slug]", "API", "Route Handler de detalle"],
  ["/api/clima", "API", "Route Handler proxy a Open-Meteo"],
];

export default function AcercaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Acerca de Rutas SV</h1>
      <p className="mt-4 text-lg text-muted">
        Rutas SV es una guía de viaje por El Salvador desarrollada como ejercicio de <strong>Vibe Coding</strong>: la
        inteligencia artificial actuó como copiloto para generar, revisar y corregir el código, mientras que las
        decisiones de arquitectura, la validación y las pruebas quedaron a cargo del desarrollador.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Tecnologías</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {STACK.map(([t, d]) => (
            <li key={t} className="rounded-xl border border-border bg-card p-4">
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Mapa de rutas</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-stone-50 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Ruta</th>
                <th className="px-4 py-3 font-medium">Página</th>
                <th className="px-4 py-3 font-medium">Tipo de renderizado</th>
              </tr>
            </thead>
            <tbody>
              {RUTAS.map(([r, p, t]) => (
                <tr key={r} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs">{r}</td>
                  <td className="px-4 py-3">{p}</td>
                  <td className="px-4 py-3 text-muted">{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Ciclo de Vibe Coding aplicado</h2>
        <ol className="mt-4 space-y-3">
          {[
            ["Concepción", "Definir la temática, las rutas y los datos antes de escribir el primer prompt."],
            ["Prompts", "Prompts con contexto, restricciones (Next.js 16, TypeScript, Tailwind) y formato de salida."],
            ["Generación iterativa", "Un componente o ruta por iteración, con commits pequeños."],
            ["Validación", "Revisión contra la documentación incluida en node_modules/next/dist/docs, lint y build."],
            ["Corrección", "Errores de lint, hidratación y cambios de API de Next.js 16 resueltos con la IA."],
            ["Optimización", "Pre-render de destinos, debounce en búsqueda y caché HTTP en el clima."],
            ["Despliegue", "Producción en Vercel con variables de entorno configuradas en el panel."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ocean-600 text-sm font-semibold text-white">{i + 1}</span>
              <p><strong>{t}:</strong> <span className="text-muted">{d}</span></p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/destinos" className="rounded-full bg-ocean-600 px-6 py-2.5 font-medium text-white hover:bg-ocean-700">Explorar destinos</Link>
        <Link href="/destinos/no-existe" className="rounded-full border border-border px-6 py-2.5 font-medium hover:bg-stone-100">Probar página 404</Link>
      </div>
    </div>
  );
}
