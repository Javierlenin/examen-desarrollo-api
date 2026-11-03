import { DomainError } from "../../../shared/DomainError";
import { parseNewBook } from "./Book";

describe('parseNewBook', () =>{
    it('returns the book data trimmed', () => {
        const result = parseNewBook({title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 3});

        expect(result).toEqual({title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 3});
    });

    it('throws when a required field is missing', () => {
        expect(() => parseNewBook({author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 3})).toThrow(DomainError);
    });

    it('throws when copies is not a positive number', () => {
        expect(() => parseNewBook({title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '9780307474728', copies: 0})).toThrow(DomainError);
    });
})