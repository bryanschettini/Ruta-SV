"use client"; // Los error boundaries deben ser Client Components

import ErrorVista from "@/components/ErrorVista";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorVista error={error} retry={retry} />;
}
