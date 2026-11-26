"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EVENTO_PLAN, leerPlan } from "@/lib/plan";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/destinos", texto: "Destinos" },
  { href: "/planificador", texto: "Mi plan" },
  { href: "/acerca", texto: "Acerca" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [enPlan, setEnPlan] = useState(0);

  // Mantiene el contador del plan sincronizado con localStorage
  useEffect(() => {
    const sincronizar = () => setEnPlan(leerPlan().length);
    const id = requestAnimationFrame(sincronizar);
    window.addEventListener(EVENTO_PLAN, sincronizar);
    window.addEventListener("storage", sincronizar);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener(EVENTO_PLAN, sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  const activo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" onClick={() => setAbierto(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ocean-600 text-lg text-white">🌋</span>
          <span className="text-lg">
            Rutas <span className="text-ocean-600">SV</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={activo(e.href) ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activo(e.href) ? "bg-ocean-600 text-white" : "text-muted hover:bg-ocean-50 hover:text-ocean-700"
                }`}
              >
                {e.texto}
                {e.href === "/planificador" && enPlan > 0 && (
                  <span className="ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-sunset-500 px-1 text-xs text-white">
                    {enPlan}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {abierto && (
        <ul id="menu-movil" className="space-y-1 border-t border-border px-4 py-3 md:hidden">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                onClick={() => setAbierto(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 font-medium ${
                  activo(e.href) ? "bg-ocean-600 text-white" : "hover:bg-ocean-50"
                }`}
              >
                {e.texto}
                {e.href === "/planificador" && enPlan > 0 && (
                  <span className="rounded-full bg-sunset-500 px-2 text-xs text-white">{enPlan}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
