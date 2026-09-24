import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { PreferenciaController } from "../../../../../controller/disponibilidad/PreferenciaController";
import { PreferenciaService } from "../../../../../service/disponibilidad/PreferenciaService";
import { PreferenciaRepository } from "../../../../../repository/disponibilidad/PreferenciaRepository";
import { UnidadAntelacion } from "../../../../../domain/preferencias/UnidadAntelacion";

const preferenciaRepository =
  new PreferenciaRepository();

const preferenciaService =
  new PreferenciaService(
    preferenciaRepository
  );

const preferenciaController =
  new PreferenciaController(
    preferenciaService
  );

export const GET: RequestHandler = async ({
  url
}) => {
  const usuarioId =
    url.searchParams.get("usuarioId");

  if (!usuarioId) {
    return json(
      {
        error:
          "El parámetro usuarioId es obligatorio."
      },
      { status: 400 }
    );
  }

  try {
    const antelacion =
      await preferenciaController.obtenerAntelacionMinima(
        usuarioId
      );

    return json(antelacion, {
      status: 200
    });
  } catch (error) {
    console.error(error);

    return json(
      {
        error: "Error interno del servidor."
      },
      { status: 500 }
    );
  }
};

export const PUT: RequestHandler = async ({
  url,
  request
}) => {
  const usuarioId =
    url.searchParams.get("usuarioId");

  if (!usuarioId) {
    return json(
      {
        error:
          "El parámetro usuarioId es obligatorio."
      },
      { status: 400 }
    );
  }

  let body: {
    valor?: number;
    unidad?: string;
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

  if (
    typeof body.valor !== "number" ||
    !Number.isInteger(body.valor) ||
    body.valor <= 0
  ) {
    return json(
      {
        error:
          "El campo valor debe ser un número entero mayor a cero."
      },
      { status: 400 }
    );
  }

  if (
    body.unidad !== UnidadAntelacion.HORAS &&
    body.unidad !== UnidadAntelacion.DIAS
  ) {
    return json(
      {
        error:
          "El campo unidad debe ser HORAS o DIAS."
      },
      { status: 400 }
    );
  }

  try {
    await preferenciaController.guardarAntelacionMinima(
      usuarioId,
      body.valor,
      body.unidad
    );

    return new Response(null, {
      status: 204
    });
  } catch (error) {
    if (error instanceof Error) {
      return json(
        {
          error: error.message
        },
        { status: 400 }
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