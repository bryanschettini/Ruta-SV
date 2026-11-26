"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Vista compartida por los archivos error.tsx */
export default function ErrorVista({
  error,
  retry,
  titulo = "Algo salió mal",
}: {
  error: unknown;
  retry: () => void;
  titulo?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center" role="alert">
      <p className="text-6xl" aria-hidden>🌋</p>
      <h1 className="mt-4 text-2xl font-bold">{titulo}</h1>
      <p className="mt-2 text-muted">
        Ocurrió un error inesperado. Puedes intentarlo de nuevo o volver al inicio.
      </p>
      {digest && <p className="mt-2 font-mono text-xs text-muted">Código: {digest}</p>}
      <div className="mt-6 flex gap-3">
        <button onClick={() => retry()} className="rounded-full bg-ocean-600 px-5 py-2.5 font-medium text-white hover:bg-ocean-700">
          Reintentar
        </button>
        <Link href="/" className="rounded-full border border-border px-5 py-2.5 font-medium hover:bg-stone-100">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
