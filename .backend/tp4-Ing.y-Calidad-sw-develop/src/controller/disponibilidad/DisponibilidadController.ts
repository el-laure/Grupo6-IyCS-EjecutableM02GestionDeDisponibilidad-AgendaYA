import { DisponibilidadService } from "../../service/disponibilidad/DisponibilidadService";
import type { DiaDisponibilidadCalendarioDTO } from "../../dto/disponibilidad/DiaDisponibilidadCalendarioDTO";
import type { DiaDisponibilidadDetalleDTO } from "../../dto/disponibilidad/DiaDisponibilidadDetalleDTO";
import type { CrearIntervaloResponseDTO } from "../../dto/disponibilidad/CrearIntervaloResponseDTO";
import type { TipoIntervalo } from "../../domain/intervalo/Intervalo";

export class DisponibilidadController {
  constructor(
    private readonly disponibilidadService: DisponibilidadService
  ) {}

  async obtenerDiasPorRango(
    usuarioId: string,
    fechaDesde: Date,
    fechaHasta: Date
  ): Promise<DiaDisponibilidadCalendarioDTO[]> {
    return this.disponibilidadService.obtenerDiasPorRango(
      usuarioId,
      fechaDesde,
      fechaHasta
    );
  }

    async bloquearDia(
    usuarioId: string,
    diaId: string
    ): Promise<void> {
    return this.disponibilidadService.bloquearDia(
        usuarioId,
        diaId
    );
    }

    async desbloquearDia(
    usuarioId: string,
    diaId: string
    ): Promise<void> {
    return this.disponibilidadService.desbloquearDia(
        usuarioId,
        diaId
    );
    }

    async obtenerDiaPorId(
    usuarioId: string,
    diaId: string
    ): Promise<DiaDisponibilidadDetalleDTO | null> {
    return this.disponibilidadService.obtenerDiaPorId(
        usuarioId,
        diaId
    );
    }

    async crearIntervalo(
    usuarioId: string,
    fecha: Date
    ): Promise<CrearIntervaloResponseDTO> {
    return this.disponibilidadService.crearIntervalo(
        usuarioId,
        fecha
    );
    }

    async configurarIntervalo(
    usuarioId: string,
    diaId: string,
    intervaloId: string,
    horaInicio: Date,
    horaFin: Date,
    tipo: TipoIntervalo
    ): Promise<void> {
    return this.disponibilidadService.configurarIntervalo(
        usuarioId,
        diaId,
        intervaloId,
        horaInicio,
        horaFin,
        tipo
    );
    }

    async eliminarIntervalo(
    usuarioId: string,
    diaId: string,
    intervaloId: string
    ): Promise<void> {
    return this.disponibilidadService.eliminarIntervalo(
        usuarioId,
        diaId,
        intervaloId
    );
    }

}