import { DomainError } from "../../../shared/DomainError";


//Interface: definir la esturtcura de los objetos vacantes
export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    copies: number;
  }
  
  //Una nueva vacante: Datos que se espera recibir desde el cliente
  export type NewBook = Omit<Book, "id">;
  
  export const parseNewBook = (input: unknown): NewBook => {
    const { title, author, isbn, copies } = (input ?? {}) as Record<
      string,
      unknown
    >;
  
    //Regla 1
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof author !== "string" ||
      !author.trim() ||
      typeof isbn !== "string" ||
      !isbn.trim()
    ) {
      throw new DomainError(
        "El título, el autor y el ISBN son obligatorios",
      );
    }
    //Regla 2
    if (typeof copies !== "number" || copies <= 0) {
      throw new DomainError("Los ejemplares deben ser un número igual o mayor que 0");
    }
  
    //Devuelve datos limpios
    return {title: title.trim(), author: author.trim(), isbn: isbn.trim(), copies: copies};
  
  };
  