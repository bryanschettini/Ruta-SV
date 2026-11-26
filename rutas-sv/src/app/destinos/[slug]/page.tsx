import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BotonPlan from "@/components/BotonPlan";
import ClimaWidget from "@/components/ClimaWidget";
import DestinoCard, { Presupuesto } from "@/components/DestinoCard";
import { CATEGORIAS, DESTINOS, destinosRelacionados, obtenerDestino } from "@/lib/destinos";

/** Pre-renderiza todas las páginas de destino en el build */
export function generateStaticParams() {
  return DESTINOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/destinos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destino = obtenerDestino(slug);
  if (!destino) return { title: "Destino no encontrado" };
  return { title: destino.nombre, description: destino.resumen };
}

/**
 * Server Component: lee los datos directamente (sin fetch HTTP) y compone
 * Client Components para las partes interactivas (clima y botón del plan).
 */
export default async function DestinoPage({ params }: PageProps<"/destinos/[slug]">) {
  const { slug } = await params;
  const destino = obtenerDestino(slug);
  if (!destino) notFound();

  const cat = CATEGORIAS[destino.categoria];
  const relacionados = destinosRelacionados(destino);
  const mapa = `https://www.openstreetmap.org/?mlat=${destino.lat}&mlon=${destino.lon}#map=13/${destino.lat}/${destino.lon}`;

  return (
    <article>
      <header className={`bg-gradient-to-br ${cat.color} text-white`}>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Ruta de navegación" className="text-sm text-white/85">
            <Link href="/destinos" className="hover:underline">Destinos</Link>
            <span className="mx-2">/</span>
            <Link href={`/destinos?categoria=${destino.categoria}`} className="hover:underline">{cat.nombre}</Link>
          </nav>
          <div className="mt-4 flex items-start gap-4 sm:items-center">
            <span className="text-6xl drop-shadow sm:text-7xl" aria-hidden>{destino.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{destino.nombre}</h1>
              <p className="mt-1 text-white/90">📍 {destino.departamento}, El Salvador</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section>
            <p className="text-lg font-medium">{destino.resumen}</p>
            <p className="mt-3 leading-relaxed text-muted">{destino.descripcion}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Qué hacer</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {destino.actividades.map((a) => (
                <li key={a} className="rounded-full bg-ocean-50 px-3.5 py-1.5 text-sm font-medium text-ocean-700">{a}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Datos prácticos</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <Dato titulo="Mejor época" valor={destino.mejorEpoca} />
              <Dato titulo="Tiempo sugerido" valor={`${destino.diasSugeridos} ${destino.diasSugeridos === 1 ? "día" : "días"}`} />
              <Dato titulo="Gasto diario aprox." valor={`~ $${destino.gastoDiarioUSD} USD por persona`} />
              <div className="rounded-xl border border-border bg-card p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">Presupuesto</dt>
                <dd className="mt-1"><Presupuesto nivel={destino.presupuesto} /></dd>
              </div>
            </dl>
            <a href={mapa} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-medium text-ocean-700 hover:underline">
              Ver en el mapa (OpenStreetMap) ↗
            </a>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <BotonPlan slug={destino.slug} dias={destino.diasSugeridos} />
          <ClimaWidget lat={destino.lat} lon={destino.lon} lugar={destino.nombre} />
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="text-xl font-semibold">También te puede gustar</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((d) => <DestinoCard key={d.slug} destino={d} />)}
          </div>
        </section>
      )}
    </article>
  );
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{titulo}</dt>
      <dd className="mt-1 text-sm font-medium">{valor}</dd>
    </div>
  );
}
