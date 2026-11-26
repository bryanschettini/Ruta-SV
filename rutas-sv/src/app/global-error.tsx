"use client";

// Reemplaza al layout raíz si este falla, por eso define <html> y <body>
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1>Rutas SV no está disponible</h1>
          <p>Ocurrió un error crítico. Intenta recargar la página.</p>
          <button onClick={() => retry()} style={{ padding: "10px 20px", borderRadius: 999, border: 0, background: "#0b766e", color: "#fff", cursor: "pointer" }}>
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
