import { InMemoryBookRepository } from './InMemoryBookRepository';

// Datos de ejemplo (datos de prueba en español).
const sampleBook = { title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 3 };

describe('InMemoryBookRepository', () => {
  it('starts empty when no initial books are given', async () => {
    const repository = new InMemoryBookRepository();

    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a book and assigns an id', async () => {
    const repository = new InMemoryBookRepository();

    const saved = await repository.save(sampleBook);

    expect(saved).toEqual({ id: 1, ...sampleBook });
  });

  it('assigns increasing ids and lists what was saved', async () => {
    const repository = new InMemoryBookRepository();

    await repository.save(sampleBook);
    const second = await repository.save(sampleBook);

    expect(second.id).toBe(2);
    expect(await repository.findAll()).toHaveLength(2);
  });

  it('finds a book by id and returns undefined when it does not exist', async () => {
        const repository = new InMemoryBookRepository();
    const saved = await repository.save(sampleBook);

    expect(await repository.findById(saved.id)).toEqual(saved);
    expect(await repository.findById(999)).toBeUndefined();
  });

});
