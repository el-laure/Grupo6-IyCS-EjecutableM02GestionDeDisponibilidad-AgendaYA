export type TipoIntervalo = "LABORAL" | "BLOQUEADO";

export class Intervalo {

  constructor(
    public readonly id: string,
    public horaInicio: Date | null,
    public horaFin: Date | null,
    public tipo: TipoIntervalo | null,
    public readonly fechaAlta: Date = new Date(),
    public fechaBaja: Date | null = null
  ) {}

  configurar(
    horaInicio: Date,
    horaFin: Date,
    tipo: TipoIntervalo
  ): void {

    if (horaInicio >= horaFin) {
      throw new Error(
        "La hora de inicio debe ser menor que la hora de fin"
      );
    }

    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.tipo = tipo;
  }

  intervaloActivo(): boolean {
    return this.fechaBaja === null;
  }

  eliminarIntervalo(): void {
    this.fechaBaja = new Date();
  }
}