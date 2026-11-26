import type { Metadata } from "next";
import { Suspense } from "react";
import ExploradorDestinos, { GridEsqueleto } from "@/components/ExploradorDestinos";

export const metadata: Metadata = {
  title: "Destinos",
  description: "Playas, volcanes, pueblos y sitios arqueológicos de El Salvador.",
};

/** Server Component: renderiza el encabezado estático y delega el filtrado al cliente */
export default function DestinosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Destinos</h1>
        <p className="mt-2 text-muted">
          Filtra por tipo de experiencia o departamento. Los datos se consultan en vivo desde{" "}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">/api/destinos</code>.
        </p>
      </header>
      {/* useSearchParams en un Client Component requiere un límite de Suspense */}
      <Suspense fallback={<GridEsqueleto />}>
        <ExploradorDestinos />
      </Suspense>
    </div>
  );
}
