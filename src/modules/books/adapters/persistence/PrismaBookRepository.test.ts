import 'dotenv/config';

import { PrismaClient } from '../../../../generated/prisma/client';
import { createPrismaClient } from '../../../../shared/database/prismaClient';
import { PrismaBookRepository } from './PrismaBookRepository';

if (!process.env.TEST_DATABASE_URL || process.env.TEST_DATABASE_URL === process.env.DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL debe existir y ser distinta de DATABASE_URL');
}

const sampleBook = {
  title: 'Cien años de soledad',
  author: 'Gabriel García Márquez',
  isbn: '9780307474728',
  copies: 3,
};

describe('PrismaBookRepository', () => {
  let prisma: PrismaClient;
  let repository: PrismaBookRepository;

  beforeAll(() => {
    prisma = createPrismaClient(process.env.TEST_DATABASE_URL as string);
    repository = new PrismaBookRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe('TRUNCATE books RESTART IDENTITY');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a book and assigns an id', async () => {
    const saved = await repository.save(sampleBook);

    expect(saved).toEqual({ id: 1, ...sampleBook });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    await repository.save(sampleBook);
    const second = await repository.save(sampleBook);

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds a book by id and returns undefined when it does not exist', async () => {
    const saved = await repository.save(sampleBook);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });
});