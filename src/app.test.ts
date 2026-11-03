// Supertest permite hacer peticiones HTTP a la app sin abrir un puerto.
import request from 'supertest';

// Importa la aplicación ya ensamblada.
import app from './app';

// Datos válidos de ejemplo (datos de prueba en español).
const validPayload = {
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    isbn: '9780307474728',
    copies: 3,

};

// Crea una vacante por HTTP y devuelve la respuesta (para obtener su id en las pruebas siguientes).
const createBook = async () => request(app).post('/books').send(validPayload);

describe('GET /books', () => {
    it('responds with 200 and the books', async () => {
        const response = await request(app).get('/books');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('POST /books', () => {
    it('creates a book and responds with 201', async () => {
        const response = await request(app).post('/books').send(validPayload);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(validPayload);
        expect(response.body.id).toBeDefined();
    });
    it('responds with 400 when required fields are missing', async () => {
        const response = await request(app).post('/books').send({ author: 'Gabriel García Márquez' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El título, el autor y el ISBN son obligatorios');
    });
    it('responds with 400 when copies is not valid', async () => {
        const response = await request(app).post('/books').send({ ...validPayload, copies: -1 });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Los ejemplares deben ser un número igual o mayor que 0');
    });
});

describe('GET /books/:id', () => {
    it('responds with 200 and the book', async () => {
        const created = await createBook();
        const response = await request(app).get(`/books/${created.body.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(created.body);
    });
    it('responds with 404 when the book does not exist', async () => {
        const response = await request(app).get('/books/9999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Libro no encontrado');
    });
    it('responds with 400 when the id is not a number', async () => {
        const response = await request(app).get('/books/abc');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El identificador no es válido');
    });
});

describe('unknown routes', () => {
    it('responds with 404 in JSON', async () => {
        const response = await request(app).get('/unknown');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Ruta no encontrada');
    });
});