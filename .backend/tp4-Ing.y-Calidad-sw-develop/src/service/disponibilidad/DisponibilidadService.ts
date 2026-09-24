import {
  DisponibilidadRepository,
  type DiaDisponibilidadRecord,
  type IntervaloRecord,
  type DiaDisponibilidadCalendarioRecord
} from "../../repository/disponibilidad/DisponibilidadRepository";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";
import {
  Intervalo,
  type TipoIntervalo
} from "../../domain/intervalo/Intervalo";
import type { DiaDisponibilidadCalendarioDTO } from "../../dto/disponibilidad/DiaDisponibilidadCalendarioDTO";
import type { DiaDisponibilidadDetalleDTO } from "../../dto/disponibilidad/DiaDisponibilidadDetalleDTO";
import type { IntervaloDTO } from "../../dto/disponibilidad/IntervaloDTO";
import type { CrearIntervaloResponseDTO } from "../../dto/disponibilidad/CrearIntervaloResponseDTO";

export class DisponibilidadService {
  constructor(
    private readonly disponibilidadRepository: DisponibilidadRepository
  ) {}

  async obtenerDia(
    usuarioId: string,
    fecha: Date
  ): Promise<DiaDisponibilidad | null> {
    const diaRecord =
      await this.disponibilidadRepository.obtenerDiaPorFecha(
        usuarioId,
        fecha
      );

    if (!diaRecord) {
      return null;
    }

    return this.reconstruirDia(diaRecord);
  }

  async obtenerOCrearDia(
    usuarioId: string,
    fecha: Date
  ): Promise<DiaDisponibilidad> {
    const existente =
      await this.disponibilidadRepository.obtenerDiaPorFecha(
        usuarioId,
        fecha
      );

    if (existente) {
      return this.reconstruirDia(existente);
    }

    const creado =
      await this.disponibilidadRepository.crearDia(
        usuarioId,
        fecha
      );

    return new DiaDisponibilidad(
      creado.id,
      creado.usuarioId,
      creado.fecha
    );
  }

  async bloquearDia(
    usuarioId: string,
    diaId: string
  ): Promise<void> {
    const dia =
      await this.disponibilidadRepository.obtenerDiaPorId(
        usuarioId,
        diaId
      );

    if (!dia) {
      throw new Error("Día de disponibilidad inexistente");
    }

    const dominio = await this.reconstruirDia(dia);

    dominio.bloquear();

    await this.disponibilidadRepository.actualizarBloqueo(
      dia.id,
      true
    );
  }

  async desbloquearDia(
    usuarioId: string,
    diaId: string
  ): Promise<void> {
    const dia =
      await this.disponibilidadRepository.obtenerDiaPorId(
        usuarioId,
        diaId
      );

    if (!dia) {
      throw new Error("Día de disponibilidad inexistente");
    }

    const dominio = await this.reconstruirDia(dia);

    dominio.desbloquear();

    await this.disponibilidadRepository.actualizarBloqueo(
      dia.id,
      false
    );
  }

  async obtenerEstado(
    usuarioId: string,
    fecha: Date
  ): Promise<DiaEstado> {
    const dia = await this.obtenerDia(
      usuarioId,
      fecha
    );

    if (!dia) {
      return DiaEstado.SIN_ASIGNAR;
    }

    return dia.obtenerEstado();
  }

  async crearIntervalo(
    usuarioId: string,
    fecha: Date
  ): Promise<CrearIntervaloResponseDTO> {
    const dia = await this.obtenerOCrearDia(
      usuarioId,
      fecha
    );

    const intervalo =
      await this.disponibilidadRepository.crearIntervalo(
        dia.id
      );

    return {
      diaId: dia.id,
      intervalo: this.mapearIntervaloRecordADTO(intervalo)
    };
  }

  async configurarIntervalo(
    usuarioId: string,
    diaId: string,
    intervaloId: string,
    horaInicio: Date,
    horaFin: Date,
    tipo: TipoIntervalo
  ): Promise<void> {
    const dia =
      await this.disponibilidadRepository.obtenerDiaPorId(
        usuarioId,
        diaId
      );

    if (!dia) {
      throw new Error("Día de disponibilidad inexistente");
    }

    const dominio = await this.reconstruirDia(dia);

    dominio.configurarIntervalo(
      intervaloId,
      horaInicio,
      horaFin,
      tipo
    );

    const horaInicioSql = this.formatearHora(horaInicio);
    const horaFinSql = this.formatearHora(horaFin);

    await this.validarSinSolapamiento(
      diaId,
      horaInicioSql,
      horaFinSql,
      intervaloId
    );

    await this.disponibilidadRepository.configurarIntervalo(
      intervaloId,
      horaInicioSql,
      horaFinSql,
      tipo
    );
  }

  async eliminarIntervalo(
    usuarioId: string,
    diaId: string,
    intervaloId: string
  ): Promise<void> {
    const dia =
      await this.disponibilidadRepository.obtenerDiaPorId(
        usuarioId,
        diaId
      );

    if (!dia) {
      throw new Error("Día de disponibilidad inexistente");
    }

    const dominio = await this.reconstruirDia(dia);

    dominio.eliminarIntervalo(intervaloId);

    await this.disponibilidadRepository.eliminarIntervalo(
      intervaloId
    );
  }

  private async reconstruirDia(
    record: DiaDisponibilidadRecord
  ): Promise<DiaDisponibilidad> {
    const dia = new DiaDisponibilidad(
      record.id,
      record.usuarioId,
      record.fecha
    );

    if (record.bloqueado) {
      dia.bloquear();
    }

    const intervalos =
      await this.disponibilidadRepository.obtenerIntervalos(
        record.id
      );

    for (const intervaloRecord of intervalos) {
      const intervalo =
        this.mapearIntervaloADominio(intervaloRecord);

      dia.agregarIntervalo(intervalo);
    }

    return dia;
  }

  private mapearIntervaloADominio(
    record: IntervaloRecord
  ): Intervalo {
    return new Intervalo(
      record.id,
      this.convertirHora(record.horaInicio),
      this.convertirHora(record.horaFin),
      record.tipo,
      record.fechaAlta,
      record.fechaBaja
    );
  }

  private async validarSinSolapamiento(
    diaId: string,
    horaInicio: string,
    horaFin: string,
    intervaloIdExcluir?: string
  ): Promise<void> {
    const conflictos =
      await this.disponibilidadRepository.obtenerIntervalosSuperpuestos(
        diaId,
        horaInicio,
        horaFin,
        intervaloIdExcluir
      );

    if (conflictos.length > 0) {
      throw new Error("Existe superposición de horarios");
    }
  }

  private convertirHora(
    hora: string | null
  ): Date | null {
    if (hora === null) {
      return null;
    }

    const [horas, minutos, segundos] =
      hora.split(":").map(Number);

    const fecha = new Date(1970, 0, 1);

    fecha.setHours(
      horas,
      minutos,
      segundos || 0,
      0
    );

    return fecha;
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().slice(0, 10);
  }

  private formatearHora(fecha: Date): string {
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    const segundos = String(fecha.getSeconds()).padStart(2, "0");

    return `${horas}:${minutos}:${segundos}`;
  }

  private formatearHoraNullable(fecha: Date | null): string | null {
    if (fecha === null) {
      return null;
    }

    return this.formatearHora(fecha);
  }

  async obtenerDiasPorRango(
    usuarioId: string,
    fechaDesde: Date,
    fechaHasta: Date
  ): Promise<DiaDisponibilidadCalendarioDTO[]> {
    const records =
      await this.disponibilidadRepository.obtenerDiasPorRango(
        usuarioId,
        fechaDesde,
        fechaHasta
      );

    return records.map((record) =>
      this.mapearDiaCalendarioADTO(record)
    );
  }

  async obtenerDiaPorId(
    usuarioId: string,
    diaId: string
  ): Promise<DiaDisponibilidadDetalleDTO | null> {
    const diaRecord =
      await this.disponibilidadRepository.obtenerDiaPorId(
        usuarioId,
        diaId
      );

    if (!diaRecord) {
      return null;
    }

    const dia = await this.reconstruirDia(diaRecord);

    return this.mapearDiaDetalleADTO(
      diaRecord.id,
      dia
    );
  }

    private mapearDiaDetalleADTO(
    diaId: string,
    dia: DiaDisponibilidad
  ): DiaDisponibilidadDetalleDTO {
    return {
      diaId,
      fecha: this.formatearFecha(dia.fecha),
      estado: dia.obtenerEstado(),
      intervalos: dia.obtenerIntervalos().map(
        (intervalo) => this.mapearIntervaloADTO(intervalo)
      )
    };
  }

  private mapearIntervaloADTO(
    intervalo: Intervalo
  ): IntervaloDTO {
    return {
      id: intervalo.id,
      horaInicio: this.formatearHoraNullable(intervalo.horaInicio),
      horaFin: this.formatearHoraNullable(intervalo.horaFin),
      tipo: intervalo.tipo
    };
  }

  private mapearDiaCalendarioADTO(
  record: DiaDisponibilidadCalendarioRecord
      ): DiaDisponibilidadCalendarioDTO {
          return {
          diaId: record.diaId,
          fecha: this.formatearFecha(record.fecha),
          estado: record.estado
          };
      }

  private mapearIntervaloRecordADTO(
    record: IntervaloRecord
  ): IntervaloDTO {
    return {
      id: record.id,
      horaInicio: record.horaInicio,
      horaFin: record.horaFin,
      tipo: record.tipo
    };
  }

}