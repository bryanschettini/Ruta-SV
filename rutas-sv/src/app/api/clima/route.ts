import type { NextRequest } from "next/server";
import { ClimaError, obtenerClima, validarCoordenadas } from "@/lib/clima";

/**
 * GET /api/clima?lat=13.69&lon=-89.19
 * Proxy hacia Open-Meteo: el navegador nunca ve la URL ni la clave del proveedor.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    const { lat, lon } = validarCoordenadas(searchParams.get("lat"), searchParams.get("lon"));
    const clima = await obtenerClima(lat, lon);
    return Response.json(clima, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" },
    });
  } catch (error) {
    if (error instanceof ClimaError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("[api/clima]", error);
    return Response.json({ error: "Error inesperado al consultar el clima." }, { status: 500 });
  }
}
