export default function CargandoDestino() {
  return (
    <div role="status">
      <span className="sr-only">Cargando destino…</span>
      <div className="skeleton h-48 w-full" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <div className="skeleton h-6 w-3/4 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    </div>
  );
}
