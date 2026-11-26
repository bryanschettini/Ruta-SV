"use client";

import ErrorVista from "@/components/ErrorVista";

export default function ErrorDestino({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorVista error={error} retry={retry} titulo="No pudimos mostrar este destino" />;
}
