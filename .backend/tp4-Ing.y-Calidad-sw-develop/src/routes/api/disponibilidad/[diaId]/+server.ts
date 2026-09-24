import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { DisponibilidadController } from "../../../../controller/disponibilidad/DisponibilidadController";
import { DisponibilidadService } from "../../../../service/disponibilidad/DisponibilidadService";
import { DisponibilidadRepository } from "../../../../repository/disponibilidad/DisponibilidadRepository";

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

export const GET: RequestHandler = async ({ params, url }) => {
  const usuarioId = url.searchParams.get("usuarioId");
  const diaId = params.diaId;

  if (!usuarioId) {
    return json(
      {
        error: "El parámetro usuarioId es obligatorio."
      },
      { status: 400 }
    );
  }

  if (!diaId) {
    return json(
      {
        error: "El parámetro diaId es obligatorio."
      },
      { status: 400 }
    );
  }

  const dia =
    await disponibilidadController.obtenerDiaPorId(
      usuarioId,
      diaId
    );

  if (!dia) {
    return json(
      {
        error: "Día de disponibilidad inexistente."
      },
      { status: 404 }
    );
  }

  return json(dia);
};