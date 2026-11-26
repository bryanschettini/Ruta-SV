# 📓 Proceso de Vibe Coding — Rutas SV

Este documento registra cómo se construyó Rutas SV con un asistente de IA (**Claude**) como copiloto: los prompts principales, las iteraciones, las decisiones técnicas y los problemas resueltos.

**Rol del desarrollador:** definir el producto, escribir los prompts, revisar cada salida, ejecutar lint/build/pruebas y decidir qué se acepta.
**Rol de la IA:** proponer arquitectura, generar código, explicar errores y proponer correcciones.

---

## 1. Concepción inicial

**Prompt 1: idea y alcance**

> Necesito desarrollar una app en Next.js 16 con App Router y TypeScript para una tarea. Requisitos: mínimo 4 rutas, consumir una API externa mediante Route Handlers, combinar Server y Client Components, usar useState y useEffect, diseño responsive, loading UI y error UI, y variables de entorno en .env.local. La temática es libre. Propón 3 ideas con temática salvadoreña que cumplan todos los requisitos sin necesitar base de datos ni API de pago.

La IA propuso: (a) guía turística con clima, (b) recetario de comida típica, (c) seguimiento de tipo de cambio. **Decisión:** se eligió la guía turística porque combina de forma natural datos locales (destinos), una API externa útil (clima) y algo de estado complejo en el cliente (planificador).

**Prompt 2: arquitectura**

> Para la guía turística "Rutas SV", diseña la arquitectura: rutas de páginas, endpoints de API, qué componentes deben ser Server y cuáles Client, y el modelo de datos en TypeScript. Usa Open-Meteo para el clima porque no requiere clave.

Resultado aceptado: 5 páginas, 3 Route Handlers, el tipo `Destino` y la división Server/Client que se ve en el README.

---

## 2. Iteraciones de generación

Cada iteración terminó en un commit (ver `git log`).

| # | Prompt (resumido) | Resultado | Commit |
|---|-------------------|-----------|--------|
| 1 | "Configura el proyecto: paleta de colores inspirada en El Salvador con Tailwind 4 (`@theme`), `.env.example` documentado y `.gitignore` que permita subir `.env.example`." | `globals.css`, `.env.example` | `chore: configurar proyecto…` |
| 2 | "Crea el layout raíz en español con un Navbar responsive (menú hamburguesa en móvil, enlace activo) y un Footer." | `layout.tsx`, `Navbar`, `Footer` | `feat: layout raíz…` |
| 3 | "Genera un catálogo de 15 destinos reales de El Salvador con coordenadas, actividades, mejor época y gasto diario estimado. Luego crea `GET /api/destinos` con filtros `q`, `categoria`, `departamento`, `GET /api/destinos/[slug]` y `GET /api/clima` que haga de proxy a Open-Meteo, validando parámetros y devolviendo errores con códigos HTTP adecuados." | `lib/destinos.ts`, `lib/clima.ts`, 3 Route Handlers | `feat: catálogo de destinos y Route Handlers…` |
| 4 | "Página de inicio como Server Component: hero, categorías y destacados. Muestra el clima actual de San Salvador con un Server Component asíncrono dentro de `<Suspense>`." | `page.tsx`, `ClimaCapital` | `feat: página de inicio…` |
| 5 | "Explorador de destinos como Client Component: buscador con debounce, filtros por chips y select, sincronización con la URL, `fetch` a `/api/destinos` en `useEffect` con `AbortController`, y estados de carga, vacío y error con botón Reintentar." | `ExploradorDestinos` | `feat: listado de destinos…` |
| 6 | "Página de detalle con `generateStaticParams`, `generateMetadata` y `notFound()`. Agrega un widget de clima cliente con pronóstico de 4 días y un botón que guarde el destino en `localStorage`." | `destinos/[slug]`, `ClimaWidget`, `BotonPlan` | `feat: página de detalle…` |
| 7 | "Planificador: lista ordenable de destinos guardados, ajustar días, notas, número de viajeros, presupuesto total y botón para copiar el itinerario. El contador del Navbar debe actualizarse sin recargar." | `Planificador`, `lib/plan.ts` | `feat: planificador…` |
| 8 | "Página Acerca con el stack, una tabla de rutas y los pasos de Vibe Coding." | `acerca/page.tsx` | `feat: página Acerca…` |
| 9 | "Agrega `loading.tsx`, `error.tsx`, `global-error.tsx` y `not-found.tsx` con el estilo del sitio." | UI de carga y error | `feat: UI de carga, error boundaries…` |
| 10 | "Estos son los errores de `npm run lint`: […]. Explica la causa y corrígelos sin desactivar reglas." | Correcciones | `fix: corregir reglas react-hooks…` |

---

## 3. Validación y revisión del código generado

Después de cada iteración:

1. **Revisión manual** del código (tipos, nombres, accesibilidad, que no se expongan secretos).
2. `npx tsc --noEmit` y `npm run lint`.
3. `npm run build` para confirmar el renderizado (estático, parcial o dinámico) de cada ruta.
4. **Pruebas de la API con `curl`:**
   - `/api/destinos?categoria=playa` → 3 resultados ✅
   - `/api/destinos?q=cafe` → búsqueda sin tildes ✅
   - `/api/destinos?categoria=xyz` → `400` ✅
   - `/api/destinos/nope` → `404` ✅
   - `/api/clima?lat=abc` → `400` ✅
   - `/api/clima` sin conexión al proveedor → `502` con mensaje claro ✅
5. **Pruebas en navegador** (escritorio 1366 px y móvil 390 px): filtros, agregar al plan, ajustar días, menú móvil y consola del navegador sin errores.

---

## 4. Decisiones técnicas

| Decisión | Motivo |
|----------|--------|
| **Server Components leen `lib/destinos.ts` directamente** y los Client Components usan `/api/*` | Hacer un `fetch` HTTP a la propia API desde el servidor añade una petición innecesaria. Las páginas servidor importan los datos; el navegador usa la API. |
| **Proxy `/api/clima`** en lugar de llamar a Open-Meteo desde el navegador | La URL y la clave quedan en el servidor (`server-only`), se valida la entrada y se añaden cabeceras de caché (`s-maxage=900`). |
| **`generateStaticParams`** en el detalle | Las 15 páginas se pre-renderizan en el build. El clima, que cambia, se carga en el cliente. |
| **`WEATHER_MOCK`** | Permite desarrollar y probar sin internet o si el proveedor falla. |
| **Filtros sincronizados con la URL** | Los enlaces de categorías desde la portada (`/destinos?categoria=volcanes`) funcionan y los resultados se pueden compartir. |
| **Debounce de 250 ms + `AbortController`** | Evita una petición por cada tecla y condiciones de carrera entre respuestas. |
| **Plan en `localStorage` con evento propio** | No requiere base de datos ni login. Un `CustomEvent` mantiene sincronizados el Navbar, el botón y el planificador. |
| **Paquete `geist` en lugar de `next/font/google`** | Las fuentes se incluyen desde npm y el build no depende de descargar Google Fonts. |
| **Emojis y degradados en lugar de fotos** | Sin problemas de derechos de imagen, carga instantánea y un estilo consistente. |

---

## 5. Desafíos y cómo se resolvieron con la IA

### 5.1 Next.js 16 no es "el Next.js que conoce la IA"
El proyecto generado incluye `AGENTS.md`, que advierte que la API cambió. Se le pidió a la IA **leer la documentación incluida en `node_modules/next/dist/docs/`** antes de escribir código. Cambios encontrados:
- `error.tsx` recibe **`retry()`** (estable desde 16.3) en lugar del antiguo `reset()`, y `error` llega tipado como `unknown`.
- **`cacheComponents: true`** viene activado: acceder a `params` en rutas dinámicas exige `generateStaticParams` o `<Suspense>`, y los datos dinámicos del servidor deben ir dentro de `<Suspense>` (se usó `connection()` en `ClimaCapital`).
- Tipos globales nuevos: `PageProps<'/ruta'>`, `LayoutProps` y `RouteContext<'/api/…'>`.

### 5.2 `Cannot find name 'RouteContext'` en TypeScript
**Causa:** los tipos de rutas se generan automáticamente y aún no existían. **Solución propuesta por la IA:** ejecutar `npx next typegen` (o `next build`/`next dev`, que los generan).

### 5.3 Lint: "Avoid constructing JSX within try/catch"
`ClimaCapital` construía el JSX dentro de un `try`. La IA explicó que un `try/catch` no captura errores de renderizado (para eso existen los error boundaries) y propuso aislar la obtención de datos: `await obtenerClima(...).catch(() => null)` y renderizar fuera.

### 5.4 Lint: "Cannot reassign variable after render completes"
El planificador calculaba el día de inicio de cada parada con una variable `let` modificada dentro del `.map()`. **Solución:** calcular `inicio` dentro del `useMemo` que une el plan con el catálogo, así el render queda puro.

### 5.5 Desajuste de hidratación con `localStorage`
`localStorage` no existe en el servidor. El estado inicial se dejó en `null` (con un esqueleto de carga) y se lee en `useEffect` después del montaje, programado con `requestAnimationFrame` para no llamar a `setState` de forma síncrona dentro del efecto.

### 5.6 Estado 200 en un destino inexistente
`/destinos/no-existe` muestra la página 404 personalizada, pero el estado HTTP es 200. La IA explicó que, con Cache Components, la respuesta empieza a transmitirse (`loading.tsx`) antes de que se ejecute `notFound()`. La opción `dynamicParams = false` **no está disponible con Cache Components**. Next.js añade automáticamente `<meta name="robots" content="noindex">`, así que los buscadores no indexan la página. Se aceptó este comportamiento y se documentó.

### 5.7 API externa sin acceso en el entorno de desarrollo
Durante las pruebas no había salida a Open-Meteo. Se agregó `WEATHER_MOCK=true` para desarrollar con datos simulados deterministas, y se aprovechó la falta de red para comprobar que la UI de error funciona (respuesta 502, mensaje en la portada y botón "Reintentar" en el widget).

---

## 6. Optimización final

- Pre-render estático de las 15 páginas de destino y de `/acerca` y `/planificador`; *partial prerender* en `/`.
- Caché CDN en `/api/clima` (`s-maxage=900, stale-while-revalidate=1800`).
- `AbortSignal.timeout(6000)` en las llamadas al proveedor externo.
- Accesibilidad: `aria-current`, `aria-pressed`, `aria-live`, `role="status"`/`"alert"`, textos `sr-only` y `prefers-reduced-motion`.

## 7. Lecciones aprendidas

1. **Darle contexto a la IA vale más que pedir código rápido.** Pedirle que lea la documentación de la versión instalada evitó usar APIs obsoletas.
2. **Iteraciones pequeñas = commits pequeños** y errores fáciles de aislar.
3. **El lint de React Hooks es un revisor más.** Los dos errores que detectó eran problemas reales, no falsos positivos.
4. La IA acelera, pero **la validación (build, curl, navegador) sigue siendo responsabilidad del desarrollador.**
