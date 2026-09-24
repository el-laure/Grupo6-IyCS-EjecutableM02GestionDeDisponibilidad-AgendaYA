import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { DisponibilidadController } from "../../../controller/disponibilidad/DisponibilidadController";
import { DisponibilidadService } from "../../../service/disponibilidad/DisponibilidadService";
import { DisponibilidadRepository } from "../../../repository/disponibilidad/DisponibilidadRepository";

const disponibilidadRepository =
  new DisponibilidadRepository();

const disponibilidadService =
  new DisponibilidadService(
    disponibilidadRepository
  );

const disponibilidadController =
  new DisponibilidadController(
    disponibilidadService
  );

export const GET: RequestHandler = async ({ url }) => {
  const usuarioId = url.searchParams.get("usuarioId");
  const desde = url.searchParams.get("desde");
  const hasta = url.searchParams.get("hasta");

  if (!usuarioId || !desde || !hasta) {
    return json(
      {
        error:
          "Los parámetros usuarioId, desde y hasta son obligatorios."
      },
      { status: 400 }
    );
  }

  const fechaDesde = new Date(`${desde}T00:00:00`);
  const fechaHasta = new Date(`${hasta}T00:00:00`);

  if (
    Number.isNaN(fechaDesde.getTime()) ||
    Number.isNaN(fechaHasta.getTime())
  ) {
    return json(
      {
        error: "Las fechas proporcionadas no son válidas."
      },
      { status: 400 }
    );
  }

  if (fechaDesde > fechaHasta) {
    return json(
      {
        error:
          "La fecha desde debe ser menor o igual a la fecha hasta."
      },
      { status: 400 }
    );
  }

  const dias =
    await disponibilidadController.obtenerDiasPorRango(
      usuarioId,
      fechaDesde,
      fechaHasta
    );

  return json(dias);
};