import { AntelacionMinima } from "../../domain/preferencias/AntelacionMinima";
import { LimiteReservasDiarias } from "../../domain/preferencias/LimiteReservasDiarias";
import { PreferenciasReuniones } from "../../domain/preferencias/PreferenciaReuniones";
import { UnidadAntelacion } from "../../domain/preferencias/UnidadAntelacion";
import {
  PreferenciaRepository,
  type PreferenciaRecord
} from "../../repository/disponibilidad/PreferenciaRepository";

export class PreferenciaService {
  constructor(
    private readonly preferenciaRepository: PreferenciaRepository
  ) {}

  async obtenerPreferencias(
    usuarioId: string
  ): Promise<PreferenciasReuniones> {
    const record =
      await this.preferenciaRepository.obtener(usuarioId);

    if (!record) {
      return new PreferenciasReuniones(usuarioId);
    }

    return this.mapearRecordADominio(record);
  }

  async guardarAntelacionMinima(
    usuarioId: string,
    valor: number,
    unidad: UnidadAntelacion
  ): Promise<void> {
    const antelacion = new AntelacionMinima(valor, unidad);

    await this.preferenciaRepository.guardarAntelacion(
      usuarioId,
      antelacion.valor,
      antelacion.unidad
    );
  }

  async guardarLimiteReservasDiarias(
    usuarioId: string,
    cantidad: number
  ): Promise<void> {
    const limite = new LimiteReservasDiarias(cantidad);

    await this.preferenciaRepository.guardarLimiteReservasDiarias(
      usuarioId,
      limite.cantidad
    );
  }

  private mapearRecordADominio(
    record: PreferenciaRecord
  ): PreferenciasReuniones {
    const preferencias = new PreferenciasReuniones(
      record.usuarioId
    );

    if (
      record.antelacionValor !== null &&
      record.antelacionUnidad !== null
    ) {
      const antelacion = new AntelacionMinima(
        record.antelacionValor,
        record.antelacionUnidad
      );

      preferencias.guardarAntelacionMinima(antelacion);
    }

    if (record.limiteReservasDiarias !== null) {
      const limite = new LimiteReservasDiarias(
        record.limiteReservasDiarias
      );

      preferencias.guardarLimiteReservasDiarias(limite);
    }

    return preferencias;
  }
}