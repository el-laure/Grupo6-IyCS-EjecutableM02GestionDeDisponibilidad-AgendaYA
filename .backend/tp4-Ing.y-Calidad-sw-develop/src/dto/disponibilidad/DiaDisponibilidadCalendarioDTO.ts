import type { DiaEstado } from "../../domain/disponibilidad/DiaEstado";

export interface DiaDisponibilidadCalendarioDTO {
  diaId: string;
  fecha: string;
  estado: DiaEstado;
}