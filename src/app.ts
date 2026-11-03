import express from 'express';

import { BookRepository } from './modules/books/ports/BookRepository';
import { BookService } from './modules/books/application/BookService';
import { createBookRouter } from './modules/books/adapters/http/bookRoutes';
import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';
import { PrismaBookRepository } from './modules/books/adapters/persistence/PrismaBookRepository';
import { createPrismaClient } from './shared/database/prismaClient';
import { InMemoryBookRepository } from './modules/books/adapters/persistence/InMemoryBookRepository';

const sampleBooks = [
    { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 3 },
  ];
const app = express();

app.use(express.json());
const createBookRepository = (): { name: string; repository: BookRepository } => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return { name: 'in memory', repository: new InMemoryBookRepository(sampleBooks) };
    }
    if (process.env.BOOKS_ADAPTER === 'prisma') {
      return { name: 'PostgreSQL with Prisma', repository: new PrismaBookRepository(createPrismaClient(databaseUrl)) };
    }
    throw new Error('BOOKS_ADAPTER is not set');
  };

const {name: booksAdapterName, repository: bookRepository} = createBookRepository();
console.log(`Books persistence: ${booksAdapterName}`);

const bookService = new BookService(bookRepository);

app.use('/books', createBookRouter(bookService));

app.use(errorHandler);
app.use(notFoundHandler);

export default app; 