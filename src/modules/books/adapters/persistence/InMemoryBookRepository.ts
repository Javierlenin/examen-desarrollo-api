import { NewBook, Book } from '../../domain/Book';
import { BookRepository } from '../../ports/BookRepository';

export class InMemoryBookRepository implements BookRepository {
  private books: Book[];
  private nextId: number;

  constructor(initialBooks: Book[] = []) {
    this.books = [...initialBooks];
    this.nextId = initialBooks.length + 1;
  }

  findAll = async (): Promise<Book[]> => [...this.books];

  findById = async (id: number): Promise<Book | undefined> => {
    const book = this.books.find((item) => item.id === id);
    return book ? { ...book } : undefined;
  };

  save = async (newBook: NewBook): Promise<Book> => {
    const book: Book = { id: this.nextId++, ...newBook };
    this.books.push(book);
    return book;
  };
}