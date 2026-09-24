import { PreferenciaService } from "../../service/disponibilidad/PreferenciaService";
import { UnidadAntelacion } from "../../domain/preferencias/UnidadAntelacion";
import type { AntelacionMinimaDTO } from "../../dto/preferencias/AntelacionMinimaDTO";
import type { LimiteReservasDiariasDTO } from "../../dto/preferencias/LimiteReservasDiariasDTO";

export class PreferenciaController {
  constructor(
    private readonly preferenciaService: PreferenciaService
  ) {}

  async obtenerAntelacionMinima(
    usuarioId: string
  ): Promise<AntelacionMinimaDTO> {
    const preferencias =
      await this.preferenciaService.obtenerPreferencias(
        usuarioId
      );

    const antelacion =
      preferencias.obtenerAntelacionMinima();

    if (!antelacion) {
      return {
        valor: null,
        unidad: null
      };
    }

    return {
      valor: antelacion.valor,
      unidad: antelacion.unidad
    };
  }

  async guardarAntelacionMinima(
    usuarioId: string,
    valor: number,
    unidad: UnidadAntelacion
  ): Promise<void> {
    return this.preferenciaService.guardarAntelacionMinima(
      usuarioId,
      valor,
      unidad
    );
  }

    async obtenerLimiteReservasDiarias(
    usuarioId: string
    ): Promise<LimiteReservasDiariasDTO> {
    const preferencias =
        await this.preferenciaService.obtenerPreferencias(
        usuarioId
        );

    const limite =
        preferencias.obtenerLimiteReservasDiarias();

    if (!limite) {
        return {
        cantidad: null
        };
    }

    return {
        cantidad: limite.cantidad
    };
    }

    async guardarLimiteReservasDiarias(
    usuarioId: string,
    cantidad: number
    ): Promise<void> {
    return this.preferenciaService.guardarLimiteReservasDiarias(
        usuarioId,
        cantidad
    );
    }
}