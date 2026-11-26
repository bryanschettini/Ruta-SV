import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-volcano-800 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-semibold text-white">Rutas SV</p>
          <p className="mt-2 text-sm">
            Proyecto académico construido con Next.js 16 y la metodología de Vibe Coding.
          </p>
        </div>
        <nav aria-label="Pie de página" className="text-sm">
          <p className="font-semibold text-white">Explorar</p>
          <ul className="mt-2 space-y-1">
            <li><Link className="hover:text-white" href="/destinos">Destinos</Link></li>
            <li><Link className="hover:text-white" href="/planificador">Mi plan</Link></li>
            <li><Link className="hover:text-white" href="/acerca">Cómo se construyó</Link></li>
          </ul>
        </nav>
        <div className="text-sm">
          <p className="font-semibold text-white">Datos</p>
          <p className="mt-2">
            Clima por{" "}
            <a className="underline hover:text-white" href="https://open-meteo.com/" target="_blank" rel="noreferrer">
              Open-Meteo
            </a>
            . Información de destinos con fines educativos; verifica horarios y precios antes de viajar.
          </p>
        </div>
      </div>
    </footer>
  );
}
