import type { NextRequest } from "next/server";
import { CATEGORIAS, filtrarDestinos, obtenerDepartamentos } from "@/lib/destinos";

/**
 * GET /api/destinos
 * Filtros opcionales: ?q=texto&categoria=playa&departamento=Santa%20Ana
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoria = searchParams.get("categoria");

  if (categoria && !(categoria in CATEGORIAS)) {
    return Response.json(
      { error: `Categoría inválida. Usa una de: ${Object.keys(CATEGORIAS).join(", ")}` },
      { status: 400 },
    );
  }

  const destinos = filtrarDestinos({
    q: searchParams.get("q"),
    categoria,
    departamento: searchParams.get("departamento"),
  });

  return Response.json({
    total: destinos.length,
    departamentos: obtenerDepartamentos(),
    destinos,
  });
}
