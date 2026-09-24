import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import { PreferenciaController } from "../../../../../controller/disponibilidad/PreferenciaController";
import { PreferenciaService } from "../../../../../service/disponibilidad/PreferenciaService";
import { PreferenciaRepository } from "../../../../../repository/disponibilidad/PreferenciaRepository";

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
    const limite =
      await preferenciaController.obtenerLimiteReservasDiarias(
        usuarioId
      );

    return json(limite, {
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
    cantidad?: number;
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
    typeof body.cantidad !== "number" ||
    !Number.isInteger(body.cantidad) ||
    body.cantidad <= 0
  ) {
    return json(
      {
        error:
          "El campo cantidad debe ser un número entero mayor a cero."
      },
      { status: 400 }
    );
  }

  try {
    await preferenciaController.guardarLimiteReservasDiarias(
      usuarioId,
      body.cantidad
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