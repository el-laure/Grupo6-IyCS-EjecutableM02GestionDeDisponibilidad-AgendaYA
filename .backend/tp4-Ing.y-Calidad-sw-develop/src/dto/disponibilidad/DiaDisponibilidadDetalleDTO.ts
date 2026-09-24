import type { DiaEstado } from "../../domain/disponibilidad/DiaEstado";
import type { IntervaloDTO } from "./IntervaloDTO";

export interface DiaDisponibilidadDetalleDTO {
  diaId: string;
  fecha: string;
  estado: DiaEstado;
  intervalos: IntervaloDTO[];
}