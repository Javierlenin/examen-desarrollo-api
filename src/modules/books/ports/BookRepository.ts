import { NewBook, Book } from '../domain/Book';

// Contrato que debe cumplir CUALQUIER lugar donde se guarden vacantes.
export interface BookRepository {
  // Devuelve todas las vacantes.
  findAll: () => Promise<Book[]>;

  // Busca una vacante por su id. "Vacancy | undefined" = o devuelve la vacante, o nada (undefined).
  findById: (id: number) => Promise<Book | undefined>;

  // Guarda una vacante nueva (sin id) y devuelve la vacante ya con su id.
  save: (newBook: NewBook) => Promise<Book>;

}
