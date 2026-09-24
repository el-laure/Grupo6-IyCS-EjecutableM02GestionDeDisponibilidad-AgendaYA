import { sql } from "$lib/server/db";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";

export interface DiaDisponibilidadRecord {
  id: string;
  usuarioId: string;
  fecha: Date;
  bloqueado: boolean;
  fechaAlta: Date;
  fechaBaja: Date | null;
}

export interface IntervaloRecord {
  id: string;
  diaId: string;
  horaInicio: string | null;
  horaFin: string | null;
  tipo: "LABORAL" | "BLOQUEADO" | null;
  fechaAlta: Date;
  fechaBaja: Date | null;
}

export interface DiaDisponibilidadCalendarioRecord {
  diaId: string;
  fecha: Date;
  estado: DiaEstado;
}

export class DisponibilidadRepository {
  async obtenerDiaPorFecha(
    usuarioId: string,
    fecha: Date
  ): Promise<DiaDisponibilidadRecord | null> {
    const fechaSql = fecha.toISOString().slice(0, 10);

    const resultado = await sql<DiaDisponibilidadRecord[]>`
      SELECT
        id::text AS "id",
        usuario_id AS "usuarioId",
        fecha,
        bloqueado,
        fecha_alta AS "fechaAlta",
        fecha_baja AS "fechaBaja"
      FROM dias_disponibilidad
      WHERE usuario_id = ${usuarioId}
        AND fecha = ${fechaSql}
        AND fecha_baja IS NULL
      LIMIT 1
    `;

    return resultado[0] ?? null;
  }

  async crearDia(
    usuarioId: string,
    fecha: Date
  ): Promise<DiaDisponibilidadRecord> {
    const fechaSql = fecha.toISOString().slice(0, 10);

    const resultado = await sql<DiaDisponibilidadRecord[]>`
      INSERT INTO dias_disponibilidad (
        usuario_id,
        fecha
      )
      VALUES (
        ${usuarioId},
        ${fechaSql}
      )
      RETURNING
        id::text AS "id",
        usuario_id AS "usuarioId",
        fecha,
        bloqueado,
        fecha_alta AS "fechaAlta",
        fecha_baja AS "fechaBaja"
    `;

    return resultado[0];
  }

  async actualizarBloqueo(
    diaId: string,
    bloqueado: boolean
  ): Promise<void> {
    await sql`
      UPDATE dias_disponibilidad
      SET bloqueado = ${bloqueado}
      WHERE id = ${diaId}
        AND fecha_baja IS NULL
    `;
  }

  async obtenerIntervalos(
    diaId: string
  ): Promise<IntervaloRecord[]> {
    return sql<IntervaloRecord[]>`
      SELECT
        id::text AS "id",
        dia_id::text AS "diaId",
        hora_inicio::text AS "horaInicio",
        hora_fin::text AS "horaFin",
        tipo,
        fecha_alta AS "fechaAlta",
        fecha_baja AS "fechaBaja"
      FROM intervalos
      WHERE dia_id = ${diaId}
        AND fecha_baja IS NULL
      ORDER BY id
    `;
  }

  async crearIntervalo(
    diaId: string
  ): Promise<IntervaloRecord> {
    const [record] = await sql<IntervaloRecord[]>`
      INSERT INTO intervalos (
        dia_id
      )
      VALUES (
        ${diaId}
      )
      RETURNING
        id::text AS id,
        dia_id::text AS "diaId",
        hora_inicio AS "horaInicio",
        hora_fin AS "horaFin",
        tipo,
        fecha_alta AS "fechaAlta",
        fecha_baja AS "fechaBaja"
    `;

    return record;
  }

  async configurarIntervalo(
    intervaloId: string,
    horaInicio: string,
    horaFin: string,
    tipo: "LABORAL" | "BLOQUEADO"
  ): Promise<void> {
    await sql`
      UPDATE intervalos
      SET
        hora_inicio = ${horaInicio},
        hora_fin = ${horaFin},
        tipo = ${tipo}
      WHERE id = ${intervaloId}
        AND fecha_baja IS NULL
    `;
  }

  async eliminarIntervalo(
    intervaloId: string
  ): Promise<void> {
    await sql`
      UPDATE intervalos
      SET fecha_baja = CURRENT_TIMESTAMP
      WHERE id = ${intervaloId}
        AND fecha_baja IS NULL
    `;
  }

  async obtenerIntervalosSuperpuestos(
    diaId: string,
    horaInicio: string,
    horaFin: string,
    intervaloIdExcluir?: string
  ): Promise<IntervaloRecord[]> {
    return sql<IntervaloRecord[]>`
      SELECT
        id::text AS id,
        dia_id::text AS "diaId",
        hora_inicio::text AS "horaInicio",
        hora_fin::text AS "horaFin",
        tipo,
        fecha_alta AS "fechaAlta",
        fecha_baja AS "fechaBaja"
      FROM intervalos
      WHERE dia_id = ${diaId}
        AND fecha_baja IS NULL
        AND hora_inicio IS NOT NULL
        AND hora_fin IS NOT NULL
        AND hora_inicio < ${horaFin}
        AND hora_fin > ${horaInicio}
        ${
          intervaloIdExcluir
            ? sql`AND id <> ${intervaloIdExcluir}`
            : sql``
        }
      ORDER BY hora_inicio
    `;
  }

  async obtenerDiaPorId(
  usuarioId: string,
  diaId: string
  ): Promise<DiaDisponibilidadRecord | null> {
    const resultado = await sql<DiaDisponibilidadRecord[]>`
      SELECT
        id::text AS "id",
        usuario_id AS "usuarioId",
        fecha,
        bloqueado,
        fecha_alta AS "fechaAlta",
        fecha_baja AS "fechaBaja"
      FROM dias_disponibilidad
      WHERE id = ${diaId}
        AND usuario_id = ${usuarioId}
        AND fecha_baja IS NULL
      LIMIT 1
    `;

    return resultado[0] ?? null;
  }

  async obtenerDiasPorRango(
    usuarioId: string,
    fechaDesde: Date,
    fechaHasta: Date
  ): Promise<DiaDisponibilidadCalendarioRecord[]> {
    const fechaDesdeSql = fechaDesde.toISOString().slice(0, 10);
    const fechaHastaSql = fechaHasta.toISOString().slice(0, 10);

    return sql<DiaDisponibilidadCalendarioRecord[]>`
      SELECT
        d.id::text AS "diaId",
        d.fecha,
        CASE
          WHEN d.bloqueado THEN 'BLOQUEADO'
          WHEN EXISTS (
            SELECT 1
            FROM intervalos i
            WHERE i.dia_id = d.id
              AND i.fecha_baja IS NULL
              AND i.hora_inicio IS NOT NULL
              AND i.hora_fin IS NOT NULL
              AND i.tipo IS NOT NULL
          )
          THEN 'HORARIO_ASIGNADO'
          ELSE 'SIN_ASIGNAR'
        END AS estado
      FROM dias_disponibilidad d
      WHERE d.usuario_id = ${usuarioId}
        AND d.fecha >= ${fechaDesdeSql}
        AND d.fecha <= ${fechaHastaSql}
        AND d.fecha_baja IS NULL
      ORDER BY d.fecha
    `;
  }
  
}

