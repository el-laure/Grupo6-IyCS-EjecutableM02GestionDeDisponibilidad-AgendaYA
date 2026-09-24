import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { DisponibilidadController } from "../../../../../controller/disponibilidad/DisponibilidadController";
import { DisponibilidadService } from "../../../../../service/disponibilidad/DisponibilidadService";
import { DisponibilidadRepository } from "../../../../../repository/disponibilidad/DisponibilidadRepository";

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

export const PATCH: RequestHandler = async ({
  params,
  url,
  request
}) => {
  const usuarioId = url.searchParams.get("usuarioId");
  const diaId = params.diaId;

  if (!usuarioId) {
    return json(
      {
        error:
          "El parámetro usuarioId es obligatorio."
      },
      { status: 400 }
    );
  }

  if (!diaId) {
    return json(
      {
        error:
          "El parámetro diaId es obligatorio."
      },
      { status: 400 }
    );
  }

  let body: {
    bloqueado?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return json(
      {
        error:
          "El cuerpo de la solicitud es obligatorio."
      },
      { status: 400 }
    );
  }

  if (typeof body.bloqueado !== "boolean") {
    return json(
      {
        error:
          "El campo bloqueado debe ser booleano."
      },
      { status: 400 }
    );
  }

  try {
    if (body.bloqueado) {
      await disponibilidadController.bloquearDia(
        usuarioId,
        diaId
      );
    } else {
      await disponibilidadController.desbloquearDia(
        usuarioId,
        diaId
      );
    }

    return new Response(null, {
      status: 204
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "Día de disponibilidad inexistente"
    ) {
      return json(
        { error: error.message },
        { status: 404 }
      );
    }

    console.error(error);

    return json(
      {
        error: "Error interno del servidor."
      },
      { status: 500 }
    );
  }
};