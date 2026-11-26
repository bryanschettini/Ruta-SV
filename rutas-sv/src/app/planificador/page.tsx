import type { Metadata } from "next";
import Planificador from "@/components/Planificador";

export const metadata: Metadata = {
  title: "Mi plan de viaje",
  description: "Arma tu itinerario por El Salvador y calcula un presupuesto estimado.",
};

export default function PlanificadorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mi plan de viaje</h1>
        <p className="mt-2 text-muted">
          Ordena tus destinos, ajusta los días y calcula un presupuesto aproximado. Tu plan se guarda en este
          navegador.
        </p>
      </header>
      <Planificador />
    </div>
  );
}
