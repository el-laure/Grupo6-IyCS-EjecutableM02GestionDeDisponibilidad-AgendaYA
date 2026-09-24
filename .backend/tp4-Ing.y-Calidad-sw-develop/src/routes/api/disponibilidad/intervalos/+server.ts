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

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const { usuarioId, fecha } = body;

  if (!usuarioId || !fecha) {
    return json(
      {
        error:
          "Los campos usuarioId y fecha son obligatorios."
      },
      { status: 400 }
    );
  }

  const fechaDate = new Date(`${fecha}T00:00:00`);

  if (Number.isNaN(fechaDate.getTime())) {
    return json(
      {
        error: "La fecha proporcionada no es válida."
      },
      { status: 400 }
    );
  }

  const resultado =
    await disponibilidadController.crearIntervalo(
      usuarioId,
      fechaDate
    );

  return json(resultado, { status: 201 });
};