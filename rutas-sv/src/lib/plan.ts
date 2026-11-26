import type { ItemPlan } from "./types";

/**
 * Persistencia del plan de viaje en localStorage (solo navegador).
 * Se emite un evento propio para que otros componentes (p. ej. el contador
 * del menú) se actualicen sin recargar la página.
 */
const CLAVE = "rutas-sv:plan";
export const EVENTO_PLAN = "rutas-sv:plan-cambio";

export function leerPlan(): ItemPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return [];
    const datos: unknown = JSON.parse(crudo);
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (i): i is ItemPlan =>
        typeof i === "object" && i !== null && typeof i.slug === "string" && typeof i.dias === "number",
    );
  } catch {
    return [];
  }
}

export function guardarPlan(plan: ItemPlan[]): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(plan));
  } catch {
    // Modo privado o almacenamiento lleno: el plan solo vive en memoria
  }
  window.dispatchEvent(new Event(EVENTO_PLAN));
}

export function agregarAlPlan(slug: string, dias: number): ItemPlan[] {
  const plan = leerPlan();
  if (plan.some((i) => i.slug === slug)) return plan;
  const nuevo = [...plan, { slug, dias, nota: "" }];
  guardarPlan(nuevo);
  return nuevo;
}

export function quitarDelPlan(slug: string): ItemPlan[] {
  const nuevo = leerPlan().filter((i) => i.slug !== slug);
  guardarPlan(nuevo);
  return nuevo;
}
