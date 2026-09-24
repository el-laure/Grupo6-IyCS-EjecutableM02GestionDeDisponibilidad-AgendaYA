import { sql } from "$lib/server/db";
import type { UnidadAntelacion } from "../../domain/preferencias/UnidadAntelacion";

export interface PreferenciaRecord {
  id: string;
  usuarioId: string;
  antelacionValor: number | null;
  antelacionUnidad: UnidadAntelacion | null;
  limiteReservasDiarias: number | null;
}

export class PreferenciaRepository {
  async obtener(
    usuarioId: string
  ): Promise<PreferenciaRecord | null> {
    const resultado = await sql<PreferenciaRecord[]>`
      SELECT
        id::text AS "id",
        usuario_id AS "usuarioId",
        antelacion_valor AS "antelacionValor",
        antelacion_unidad AS "antelacionUnidad",
        limite_reservas_diarias AS "limiteReservasDiarias"
      FROM preferencias_reuniones
      WHERE usuario_id = ${usuarioId}
      LIMIT 1
    `;

    return resultado[0] ?? null;
  }

  async guardarAntelacion(
    usuarioId: string,
    valor: number,
    unidad: "HORAS" | "DIAS"
  ): Promise<void> {
    const existente = await this.obtener(usuarioId);

    if (existente) {
      await sql`
        UPDATE preferencias_reuniones
        SET
          antelacion_valor = ${valor},
          antelacion_unidad = ${unidad}
        WHERE usuario_id = ${usuarioId}
      `;

      return;
    }

    await sql`
      INSERT INTO preferencias_reuniones (
        usuario_id,
        antelacion_valor,
        antelacion_unidad
      )
      VALUES (
        ${usuarioId},
        ${valor},
        ${unidad}
      )
    `;
  }

  async guardarLimiteReservasDiarias(
    usuarioId: string,
    cantidad: number
  ): Promise<void> {
    const existente = await this.obtener(usuarioId);

    if (existente) {
      await sql`
        UPDATE preferencias_reuniones
        SET
          limite_reservas_diarias = ${cantidad}
        WHERE usuario_id = ${usuarioId}
      `;

      return;
    }

    await sql`
      INSERT INTO preferencias_reuniones (
        usuario_id,
        limite_reservas_diarias
      )
      VALUES (
        ${usuarioId},
        ${cantidad}
      )
    `;
  }
}