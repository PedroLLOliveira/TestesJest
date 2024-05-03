import { Character, validateCharacter } from '../src/Character';

describe('validateCharacter function', () => {
  // a.
  test('should return false for character with empty name', () => {
    const character: Character = {
      nome: '',
      vida: 1500,
      defesa: 200,
      forca: 300,
    };
    expect(validateCharacter(character)).toBe(false);
  });

  // b.
  test('should return false for character with vida equals zero', () => {
    const character: Character = {
      nome: 'Herói',
      vida: 0,
      defesa: 100,
      forca: 200,
    }
    expect(validateCharacter(character)).toBe(false)
  });

  // c.
  test('should return false for character with forca equals zero', () => {
    const character: Character = {
      nome: 'Herói',
      vida: 1500,
      defesa: 100,
      forca: 0,
    }
    expect(validateCharacter(character)).toBe(false)
  });
  
  // d.
  test('should return false for character with defesa equals zero', () => {
    const character: Character = {
      nome: 'Herói',
      vida: 1500,
      defesa: 0,
      forca: 200,
    }
    expect(validateCharacter(character)).toBe(false)
  });

  // e.
  test('should return false for character with zero or negative vida, defesa, or forca', () => {
    const character: Character = {
      nome: 'Herói',
      vida: -100,
      defesa: 0,
      forca: 200,
    };
    expect(validateCharacter(character)).toBe(false);
  });

  // f.
  test('should return true for valid character', () => {
    const validCharacter: Character = {
      nome: 'Herói',
      vida: 1500,
      defesa: 200,
      forca: 300,
    };
    expect(validateCharacter(validCharacter)).toBe(true);
  });
});
