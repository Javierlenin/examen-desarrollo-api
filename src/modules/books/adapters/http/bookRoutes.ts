import { Router } from "express";

import { DomainError } from "../../../../shared/DomainError";

import { HTTP_STATUS } from "../../../../shared/httpStatus";

import { BookService } from "../../application/BookService";

// Convierte el id que llega como texto ("5") en número (5) y comprueba que sea válido.
const parseId = (value: string): number => {
  // "Number" convierte el texto en número; si no se puede, devuelve NaN.
  const id = Number(value);

  // Debe ser un número entero y positivo (no "abc", ni 1.5, ni -3).
  if (!Number.isInteger(id) || id <= 0) {
    // Si no lo es, se lanza un error de negocio: el usuario envió un dato inválido.
    throw new DomainError("El identificador no es válido");
  }

  // Si es válido, lo devuelve ya convertido a número.
  return id;
};

// Recibe el servicio desde afuera (inyección de dependencias) y devuelve las rutas ya armadas.
export const createBookRouter = (service: BookService): Router => {
  // Crea el grupo de rutas vacío.
  const router = Router();

  // GET /books → listar todos los libros.
  router.get("/", async (req, res) => {
    // Pide la lista al caso de uso "list".
    const books = await service.list();

    // Responde 200 con la lista en JSON.
    res.status(HTTP_STATUS.OK).json(books);
  });

  // GET /books/:id → ver un libro.
  router.get("/:id", async (req, res) => {
    // Lee el id de la dirección, lo valida y lo convierte; luego pide el libro al caso de uso.
    const book = await service.getById(parseId(req.params.id));

    // Responde 200 con el libro.
    res.status(HTTP_STATUS.OK).json(book);
  });

  // POST /books → crear un libro.
  router.post("/", async (req, res) => {
    // Pasa los datos del cuerpo al caso de uso; si son inválidos, el dominio lanza DomainError (→ 400).
    const book = await service.create(req.body);

    // Responde 201 (creada) con el libro y su id.
    res.status(HTTP_STATUS.CREATED).json(book);
  });

  // Devuelve el grupo de rutas listo para conectarlo en app.ts.
  return router;
};

