import type { TipoIntervalo } from "../../domain/intervalo/Intervalo";

export interface IntervaloDTO {
  id: string;
  horaInicio: string | null;
  horaFin: string | null;
  tipo: TipoIntervalo | null;
}