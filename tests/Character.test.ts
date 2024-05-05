import { Character, validateCharacter } from "../src/Character";
import { CharacterBusiness } from "../src/business/CharacterBusiness";
import { CharacterDataBase } from "../src/data/CharacterDatabase";
import { CharacterModel } from "../src/model/CharacterModel";

// exercicio 4
test("showing jest.fn", () => {
  const mock = jest.fn(() => {
    const user = {
      name: "Fravio",
      age: 99,
    };
    return user;
  });
});

test("mock validateCharacter sucesso", () => {
  const validateCharacterMock = jest.fn(() => {
    return true;
  });
});

test("mock parformAttacke sucesso", () => {
  const performAttackeMock = jest.fn(() => {
    const defenderMock = {
      name: "",
      vida: 1200,
      defesa: 100,
      forca: 300,
    };
    return { defenderMock };
  });
});

test("mock validateCharacter erro", () => {
  const validateCharacterMock = jest.fn(() => {
    return false;
  });
});

test("mock parformAttacke erro", () => {
  const performAttackeMock = jest.fn(() => {
    return "Defesa maior, nenhuma vida tirada!";
  });
});

// exercicio 5
describe("check performAttacke function", () => {
  // a.
  test("tirando 200 de vida do defensor", async () => {
    const characterDataBase = new CharacterDataBase();
    const characterBusiness = new CharacterBusiness(characterDataBase);
    const validateCharacterMock = jest.fn(() => true);

    const attacker = new CharacterModel("TinkerCAD", 1500, 400, 600);
    const defender = new CharacterModel("RUBENS", 1500, 300, 200);

    try {
      const result = await characterBusiness.performAttacke(
        attacker,
        defender,
        validateCharacterMock
      );

      if (typeof result !== "string") {
        // verificando se o resultado é igual a 1300 que vai ser tirado 200 de vida
        expect(result).toBe(1300);
      } else {
        expect(result).toBe("Defesa maior, nenhuma vida tirada!");
      }
    } catch (error) {
      console.log(error);
    }
    // verificando se a função mockada foi chamada
    expect(validateCharacterMock).toHaveBeenCalledTimes(2);

    // verificando quantas vezes a função mockada retornou true
    expect(
      validateCharacterMock.mock.results.filter(
        (result) => result.value === true
      ).length
    ).toBe(2);
  });

  // b.
  test("Personagem com informação inválida", async () => {
    const characterDataBase = new CharacterDataBase();
    const characterBusiness = new CharacterBusiness(characterDataBase);
    const validateCharacterMock = jest.fn(() => true);

    const attacker = new CharacterModel("", 1500, 400, 600);
    const defender = new CharacterModel("RUBENS", 1500, 300, 200);
    try {
      await characterBusiness.performAttacke(
        attacker,
        defender,
        validateCharacterMock
      );
    } catch (err: any) {
      // verificando a mensagem de erro
      expect(err.message).toBe("Character Invalid");
    }

    // verificando se a função mockada foi chamada apenas para o atacante
    expect(validateCharacterMock).toHaveBeenCalledTimes(2);

    // verificando quantas vezes a função mockada retornou true
    expect(
      validateCharacterMock.mock.results.filter(
        (result) => result.value === true
      ).length
    ).toBe(2);
  });
});

describe("validateCharacter function", () => {
  // a.
  test("should return false for character with empty name", () => {
    const character: Character = {
      nome: "",
      vida: 1500,
      defesa: 200,
      forca: 300,
    };
    expect(validateCharacter(character)).toBe(false);
  });

  // b.
  test("should return false for character with vida equals zero", () => {
    const character: Character = {
      nome: "Herói",
      vida: 0,
      defesa: 100,
      forca: 200,
    };
    expect(validateCharacter(character)).toBe(false);
  });

  // c.
  test("should return false for character with forca equals zero", () => {
    const character: Character = {
      nome: "Herói",
      vida: 1500,
      defesa: 100,
      forca: 0,
    };
    expect(validateCharacter(character)).toBe(false);
  });

  // d.
  test("should return false for character with defesa equals zero", () => {
    const character: Character = {
      nome: "Herói",
      vida: 1500,
      defesa: 0,
      forca: 200,
    };
    expect(validateCharacter(character)).toBe(false);
  });

  // e.
  test("should return false for character with zero or negative vida, defesa, or forca", () => {
    const character: Character = {
      nome: "Herói",
      vida: -100,
      defesa: 0,
      forca: 200,
    };
    expect(validateCharacter(character)).toBe(false);
  });

  // f.
  test("should return true for valid character", () => {
    const validCharacter: Character = {
      nome: "Herói",
      vida: 1500,
      defesa: 200,
      forca: 300,
    };
    expect(validateCharacter(validCharacter)).toBe(true);
  });
});
