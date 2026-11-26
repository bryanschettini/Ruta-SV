export type Categoria = "playa" | "volcanes" | "pueblos" | "arqueologia" | "naturaleza";

export type Presupuesto = 1 | 2 | 3;

export interface Destino {
  slug: string;
  nombre: string;
  departamento: string;
  categoria: Categoria;
  resumen: string;
  descripcion: string;
  actividades: string[];
  mejorEpoca: string;
  /** Días sugeridos para visitarlo */
  diasSugeridos: number;
  /** 1 = económico, 2 = moderado, 3 = alto */
  presupuesto: Presupuesto;
  /** Gasto diario aproximado por persona en USD (referencial) */
  gastoDiarioUSD: number;
  lat: number;
  lon: number;
  emoji: string;
  destacado?: boolean;
}

export interface ClimaActual {
  temperatura: number;
  sensacion: number;
  humedad: number;
  viento: number;
  codigo: number;
  descripcion: string;
  icono: string;
}

export interface ClimaDia {
  fecha: string;
  max: number;
  min: number;
  probLluvia: number;
  codigo: number;
  descripcion: string;
  icono: string;
}

export interface Clima {
  actual: ClimaActual;
  dias: ClimaDia[];
  fuente: "open-meteo" | "simulado";
  actualizado: string;
}

export interface ItemPlan {
  slug: string;
  dias: number;
  nota: string;
}

export interface ApiError {
  error: string;
}
