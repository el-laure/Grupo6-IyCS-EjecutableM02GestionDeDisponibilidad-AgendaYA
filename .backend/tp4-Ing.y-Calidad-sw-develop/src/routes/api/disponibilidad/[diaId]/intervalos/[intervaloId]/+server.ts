import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { DisponibilidadController } from "../../../../../../controller/disponibilidad/DisponibilidadController";
import { DisponibilidadService } from "../../../../../../service/disponibilidad/DisponibilidadService";
import { DisponibilidadRepository } from "../../../../../../repository/disponibilidad/DisponibilidadRepository";
import type { TipoIntervalo } from "../../../../../../domain/intervalo/Intervalo";

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
  const intervaloId = params.intervaloId;

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

  if (!intervaloId) {
    return json(
      {
        error:
          "El parámetro intervaloId es obligatorio."
      },
      { status: 400 }
    );
  }

  const body = await request.json();

  const {
    horaInicio,
    horaFin,
    tipo
  } = body;

  if (!horaInicio || !horaFin || !tipo) {
    return json(
      {
        error:
          "Los campos horaInicio, horaFin y tipo son obligatorios."
      },
      { status: 400 }
    );
  }

  if (
    tipo !== "LABORAL" &&
    tipo !== "BLOQUEADO"
  ) {
    return json(
      {
        error:
          "El tipo de intervalo no es válido."
      },
      { status: 400 }
    );
  }

  const fechaBase = "2026-01-01";

  const horaInicioDate =
    new Date(`${fechaBase}T${horaInicio}`);

  const horaFinDate =
    new Date(`${fechaBase}T${horaFin}`);

  if (
    Number.isNaN(horaInicioDate.getTime()) ||
    Number.isNaN(horaFinDate.getTime())
  ) {
    return json(
      {
        error:
          "Las horas proporcionadas no son válidas."
      },
      { status: 400 }
    );
  }

  try {
    await disponibilidadController.configurarIntervalo(
      usuarioId,
      diaId,
      intervaloId,
      horaInicioDate,
      horaFinDate,
      tipo as TipoIntervalo
    );

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
        {
          error: error.message
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "Intervalo inexistente"
    ) {
      return json(
        {
          error: error.message
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "La hora de inicio debe ser menor que la hora de fin"
    ) {
      return json(
        {
          error: error.message
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Existe superposición de horarios"
    ) {
      return json({ error: error.message }, { status: 409 });
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

export const DELETE: RequestHandler = async ({
  params,
  url
}) => {
  const usuarioId = url.searchParams.get("usuarioId");
  const diaId = params.diaId;
  const intervaloId = params.intervaloId;

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

  if (!intervaloId) {
    return json(
      {
        error:
          "El parámetro intervaloId es obligatorio."
      },
      { status: 400 }
    );
  }

  try {
    await disponibilidadController.eliminarIntervalo(
      usuarioId,
      diaId,
      intervaloId
    );

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

    if (
      error instanceof Error &&
      error.message ===
        "Intervalo inexistente"
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