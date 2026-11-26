import Link from "next/link";
import { CATEGORIAS } from "@/lib/destinos";
import type { Destino } from "@/lib/types";

export function Presupuesto({ nivel }: { nivel: 1 | 2 | 3 }) {
  return (
    <span aria-label={`Presupuesto nivel ${nivel} de 3`} className="font-mono text-sm">
      <span className="text-ocean-700">{"$".repeat(nivel)}</span>
      <span className="text-stone-300">{"$".repeat(3 - nivel)}</span>
    </span>
  );
}

export default function DestinoCard({ destino }: { destino: Destino }) {
  const cat = CATEGORIAS[destino.categoria];
  return (
    <Link
      href={`/destinos/${destino.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean-600"
    >
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${cat.color}`}>
        <span className="text-6xl drop-shadow-md transition group-hover:scale-110" aria-hidden>
          {destino.emoji}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground">
          {cat.emoji} {cat.nombre}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{destino.departamento}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-ocean-700">{destino.nombre}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{destino.resumen}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted">
            {destino.diasSugeridos} {destino.diasSugeridos === 1 ? "día" : "días"}
          </span>
          <Presupuesto nivel={destino.presupuesto} />
        </div>
      </div>
    </Link>
  );
}
