# 🌋 Rutas SV — Planifica tu viaje por El Salvador

Aplicación web construida con **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4** utilizando la metodología de **Vibe Coding** (IA como copiloto de desarrollo).

Permite explorar 15 destinos turísticos de El Salvador (playas, volcanes, pueblos, arqueología y naturaleza), consultar el **clima en tiempo real** de cada destino y armar un **itinerario con presupuesto estimado**.

🔗 **Demo en producción:** https://TU-PROYECTO.vercel.app  <!-- ⚠️ Reemplazar con la URL real de Vercel -->

📓 **Proceso de Vibe Coding:** ver [VIBE_CODING.md](./VIBE_CODING.md)

---

## ✨ Funcionalidades

| Ruta | Descripción | Tipo |
|------|-------------|------|
| `/` | Inicio con categorías, destinos destacados y clima actual de San Salvador | Server Component + `<Suspense>` |
| `/destinos` | Explorador con búsqueda, filtros por categoría y departamento (sincronizados con la URL) | Client Component (`useState`, `useEffect`) |
| `/destinos/[slug]` | Detalle del destino, pronóstico de 4 días y botón "Agregar a mi plan" | Server Component + Client Components |
| `/planificador` | Itinerario: reordenar, ajustar días, notas, nº de viajeros, presupuesto y copiar resumen | Client Component + `localStorage` |
| `/acerca` | Stack, mapa de rutas y ciclo de Vibe Coding | Server Component estático |

### API interna (Route Handlers)

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/destinos?q=&categoria=&departamento=` | Lista filtrada de destinos. Devuelve `400` si la categoría no es válida |
| `GET /api/destinos/[slug]` | Detalle de un destino. Devuelve `404` si no existe |
| `GET /api/clima?lat=&lon=` | Proxy a la API externa **Open-Meteo**. Valida coordenadas (`400`) y maneja fallos del proveedor (`502`) |

### Requisitos técnicos cubiertos

- ✅ Next.js 16.4 con App Router y TypeScript
- ✅ 5 páginas + 3 endpoints de API
- ✅ Consumo de API externa (Open-Meteo) a través de Route Handlers y desde un Server Component
- ✅ Server Components y Client Components combinados
- ✅ `useState` y `useEffect` (filtros, fetch con `AbortController`, debounce, `localStorage`, eventos)
- ✅ Diseño responsive (mobile-first, menú hamburguesa)
- ✅ Loading UI: `loading.tsx`, `<Suspense>` y esqueletos animados
- ✅ Error UI: `error.tsx`, `global-error.tsx`, `not-found.tsx` y errores con botón "Reintentar" en los componentes cliente
- ✅ Variables de entorno en `.env.local` (documentadas en `.env.example`)

---

## 🚀 Instalación y uso local

**Requisitos:** Node.js 20.9 o superior y npm.

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/rutas-sv.git
cd rutas-sv

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Ejecutar en modo desarrollo
npm run dev
```

Abrir http://localhost:3000.

### Scripts

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servir el build de producción |
| `npm run lint` | ESLint (reglas de Next.js y React Hooks) |

### Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `WEATHER_API_URL` | No | URL base de la API de pronóstico. Por defecto `https://api.open-meteo.com/v1/forecast` |
| `WEATHER_API_KEY` | No | Clave del proveedor de clima. Open-Meteo gratuito no la requiere; preparada para planes con clave |
| `WEATHER_MOCK` | No | `true` devuelve clima simulado (útil sin internet). En producción: `false` |
| `NEXT_PUBLIC_SITE_NAME` | No | Nombre público del sitio |

> Las variables sin prefijo `NEXT_PUBLIC_` solo existen en el servidor: el navegador nunca ve la URL ni la clave del proveedor de clima, porque todas las consultas pasan por `/api/clima`.

---

## ☁️ Despliegue en Vercel

1. Subir el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importar el repositorio (Vercel detecta Next.js automáticamente).
3. En **Settings → Environment Variables**, agregar las variables de `.env.example` (con `WEATHER_MOCK=false`).
4. Pulsar **Deploy**. Cada `git push` a `main` genera un nuevo despliegue.

---

## 🗂️ Estructura

```
src/
├── app/
│   ├── api/
│   │   ├── clima/route.ts            # Proxy a Open-Meteo
│   │   └── destinos/
│   │       ├── route.ts              # Lista + filtros
│   │       └── [slug]/route.ts       # Detalle
│   ├── destinos/
│   │   ├── page.tsx                  # Explorador
│   │   └── [slug]/                   # Detalle + loading + error
│   ├── planificador/page.tsx
│   ├── acerca/page.tsx
│   ├── layout.tsx  page.tsx  loading.tsx  error.tsx  global-error.tsx  not-found.tsx
│   └── globals.css
├── components/                       # Navbar, DestinoCard, ClimaWidget, Planificador…
└── lib/
    ├── destinos.ts                   # Catálogo y filtros
    ├── clima.ts                      # Cliente de Open-Meteo (server-only)
    ├── plan.ts                       # Persistencia en localStorage
    └── types.ts
```

## 📝 Créditos

- Datos meteorológicos: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0).
- La información de destinos tiene fines educativos; los gastos son estimaciones referenciales.
