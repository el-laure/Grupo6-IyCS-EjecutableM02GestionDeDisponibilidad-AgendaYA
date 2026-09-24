export interface ConfigurarIntervaloDTO {
  horaInicio: string;
  horaFin: string;
  tipo: "LABORAL" | "BLOQUEADO";
}