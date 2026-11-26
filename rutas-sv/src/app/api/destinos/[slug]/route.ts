import { obtenerDestino } from "@/lib/destinos";

/** GET /api/destinos/:slug — detalle de un destino */
export async function GET(_request: Request, ctx: RouteContext<"/api/destinos/[slug]">) {
  const { slug } = await ctx.params;
  const destino = obtenerDestino(slug);

  if (!destino) {
    return Response.json({ error: `No existe el destino "${slug}".` }, { status: 404 });
  }

  return Response.json(destino);
}
