"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { agregarAlPlan, EVENTO_PLAN, leerPlan, quitarDelPlan } from "@/lib/plan";

export default function BotonPlan({ slug, dias }: { slug: string; dias: number }) {
  // null = aún no sabemos (evita desajustes de hidratación con localStorage)
  const [enPlan, setEnPlan] = useState<boolean | null>(null);

  useEffect(() => {
    const sincronizar = () => setEnPlan(leerPlan().some((i) => i.slug === slug));
    const id = requestAnimationFrame(sincronizar);
    window.addEventListener(EVENTO_PLAN, sincronizar);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener(EVENTO_PLAN, sincronizar);
    };
  }, [slug]);

  if (enPlan === null) {
    return <div className="skeleton h-11 w-full rounded-full" aria-hidden />;
  }

  return enPlan ? (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Link
        href="/planificador"
        className="flex-1 rounded-full bg-ocean-600 px-5 py-2.5 text-center font-medium text-white hover:bg-ocean-700"
      >
        ✓ En tu plan · Ver plan
      </Link>
      <button
        onClick={() => quitarDelPlan(slug)}
        className="rounded-full border border-border px-5 py-2.5 font-medium text-muted hover:border-sunset-500 hover:text-sunset-600"
      >
        Quitar
      </button>
    </div>
  ) : (
    <button
      onClick={() => agregarAlPlan(slug, dias)}
      className="w-full rounded-full bg-sunset-500 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-sunset-600"
    >
      + Agregar a mi plan
    </button>
  );
}
