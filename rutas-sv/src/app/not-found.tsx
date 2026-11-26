import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-bold text-ocean-600">404</p>
      <h1 className="mt-3 text-2xl font-bold">Este camino no lleva a ningún lado</h1>
      <p className="mt-2 text-muted">La página o el destino que buscas no existe (todavía).</p>
      <div className="mt-6 flex gap-3">
        <Link href="/destinos" className="rounded-full bg-ocean-600 px-5 py-2.5 font-medium text-white hover:bg-ocean-700">
          Ver destinos
        </Link>
        <Link href="/" className="rounded-full border border-border px-5 py-2.5 font-medium hover:bg-stone-100">
          Inicio
        </Link>
      </div>
    </div>
  );
}
