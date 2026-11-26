import "server-only";
import type { Clima, ClimaDia } from "./types";

/** Traducción de los códigos WMO que devuelve Open-Meteo */
const CODIGOS_WMO: Record<number, { descripcion: string; icono: string }> = {
  0: { descripcion: "Despejado", icono: "☀️" },
  1: { descripcion: "Mayormente despejado", icono: "🌤️" },
  2: { descripcion: "Parcialmente nublado", icono: "⛅" },
  3: { descripcion: "Nublado", icono: "☁️" },
  45: { descripcion: "Neblina", icono: "🌫️" },
  48: { descripcion: "Neblina con escarcha", icono: "🌫️" },
  51: { descripcion: "Llovizna ligera", icono: "🌦️" },
  53: { descripcion: "Llovizna", icono: "🌦️" },
  55: { descripcion: "Llovizna intensa", icono: "🌧️" },
  61: { descripcion: "Lluvia ligera", icono: "🌦️" },
  63: { descripcion: "Lluvia", icono: "🌧️" },
  65: { descripcion: "Lluvia intensa", icono: "🌧️" },
  80: { descripcion: "Chubascos ligeros", icono: "🌦️" },
  81: { descripcion: "Chubascos", icono: "🌧️" },
  82: { descripcion: "Chubascos fuertes", icono: "⛈️" },
  95: { descripcion: "Tormenta eléctrica", icono: "⛈️" },
  96: { descripcion: "Tormenta con granizo", icono: "⛈️" },
  99: { descripcion: "Tormenta fuerte con granizo", icono: "⛈️" },
};

export function describirCodigo(codigo: number) {
  return CODIGOS_WMO[codigo] ?? { descripcion: "Condición variable", icono: "🌡️" };
}

/** Forma (parcial) de la respuesta de Open-Meteo que usamos */
interface OpenMeteoRespuesta {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
}

export class ClimaError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
    this.name = "ClimaError";
  }
}

function climaSimulado(lat: number, lon: number): Clima {
  // Valores deterministas según la ubicación para que la UI sea estable
  const base = 22 + Math.round(((Math.abs(lat * 7 + lon * 3) % 10) - 2) * 10) / 10;
  const codigos = [1, 2, 80, 3];
  const hoy = new Date();
  const dias: ClimaDia[] = Array.from({ length: 4 }, (_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const codigo = codigos[i % codigos.length];
    return {
      fecha: fecha.toISOString().slice(0, 10),
      max: Math.round((base + 6 - i * 0.4) * 10) / 10,
      min: Math.round((base - 4 + i * 0.3) * 10) / 10,
      probLluvia: [10, 25, 60, 35][i],
      codigo,
      ...describirCodigo(codigo),
    };
  });
  return {
    actual: {
      temperatura: base + 3,
      sensacion: base + 4,
      humedad: 68,
      viento: 9,
      codigo: 2,
      ...describirCodigo(2),
    },
    dias,
    fuente: "simulado",
    actualizado: hoy.toISOString(),
  };
}

export function validarCoordenadas(lat: unknown, lon: unknown): { lat: number; lon: number } {
  const la = Number(lat);
  const lo = Number(lon);
  if (lat === null || lon === null || lat === "" || lon === "" || Number.isNaN(la) || Number.isNaN(lo)) {
    throw new ClimaError("Los parámetros 'lat' y 'lon' son obligatorios y deben ser numéricos.", 400);
  }
  if (la < -90 || la > 90 || lo < -180 || lo > 180) {
    throw new ClimaError("Coordenadas fuera de rango.", 400);
  }
  return { lat: la, lon: lo };
}

/**
 * Obtiene el clima actual y el pronóstico de 4 días desde Open-Meteo.
 * Solo se ejecuta en el servidor: la URL y la clave vienen de variables de entorno.
 */
export async function obtenerClima(lat: number, lon: number): Promise<Clima> {
  if (process.env.WEATHER_MOCK === "true") {
    return climaSimulado(lat, lon);
  }

  const base = process.env.WEATHER_API_URL || "https://api.open-meteo.com/v1/forecast";
  const url = new URL(base);
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
  );
  url.searchParams.set("timezone", "America/El_Salvador");
  url.searchParams.set("forecast_days", "4");
  if (process.env.WEATHER_API_KEY) {
    url.searchParams.set("apikey", process.env.WEATHER_API_KEY);
  }

  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  } catch {
    throw new ClimaError("No se pudo conectar con el servicio de clima.");
  }

  if (!res.ok) {
    throw new ClimaError(`El servicio de clima respondió con estado ${res.status}.`);
  }

  const datos = (await res.json()) as OpenMeteoRespuesta;
  if (!datos.current || !datos.daily) {
    throw new ClimaError("Respuesta de clima incompleta.");
  }

  return {
    actual: {
      temperatura: datos.current.temperature_2m,
      sensacion: datos.current.apparent_temperature,
      humedad: datos.current.relative_humidity_2m,
      viento: datos.current.wind_speed_10m,
      codigo: datos.current.weather_code,
      ...describirCodigo(datos.current.weather_code),
    },
    dias: datos.daily.time.map((fecha, i) => ({
      fecha,
      max: datos.daily.temperature_2m_max[i],
      min: datos.daily.temperature_2m_min[i],
      probLluvia: datos.daily.precipitation_probability_max[i] ?? 0,
      codigo: datos.daily.weather_code[i],
      ...describirCodigo(datos.daily.weather_code[i]),
    })),
    fuente: "open-meteo",
    actualizado: datos.current.time,
  };
}
