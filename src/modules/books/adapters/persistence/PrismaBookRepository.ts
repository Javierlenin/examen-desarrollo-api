import { PrismaClient } from "../../../../generated/prisma/client";
import { NewBook, Book } from "../../domain/Book";
import { BookRepository } from "../../ports/BookRepository";

//Como llega un registro desde prisma.
type BookRecord = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  copies: number;
};

//Mapeo: convierte un registro de Prisma en un objeto Vacancy del dominio.
const toBook = (record: BookRecord): Book => ({
  id: record.id,
  title: record.title,
  author: record.author,
  isbn: record.isbn,
  copies: record.copies,
});

const isRecordNotFound = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { code?: string }).code === "P2025";

export class PrismaBookRepository implements BookRepository {
  constructor(private readonly prisma: PrismaClient) {}

  //Listar todos los libros.
  findAll = async (): Promise<Book[]> => {
    const records = await this.prisma.book.findMany({
      orderBy: { id: "asc" },
    });
    return records.map(toBook);
  };
        
  //Busca un libro por id
  findById = async (id: number): Promise<Book | undefined> => {
    const record = await this.prisma.book.findUnique({ where: { id } });
    return record ? toBook(record) : undefined;
  };

  //Guardar un libro.
  save = async (newBook: NewBook): Promise<Book> => {
    const record = await this.prisma.book.create({ data: newBook });
    return toBook(record);
  };


}
