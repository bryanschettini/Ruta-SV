/** UI de carga global: se muestra mientras se resuelve cualquier segmento sin loading propio */
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 py-32" role="status">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-ocean-100 border-t-ocean-600" />
      <p className="text-muted">Cargando…</p>
    </div>
  );
}
