/**
 * Teste 1: Erro que deve retornar quando o nome está vazio
 * Teste 2: Erro que deve retornar quando o email é inválido
 * Teste 3: Erro que deve retornar quando a senha é inválida
 * Teste 4: Erro que deve retornar quando o tipo de usuário é inválido
 * Teste 5: Sucesso no cadastro e verificação do token de acesso
 */

import { UserBusiness } from "../src/business/UserBusiness";
import { CustomError } from "../src/errors/CustomError";
import { TokenGenerator } from "../src/services/tokenGenerator";
import { HashGeneratorMock } from "./mocks/hashGeneratorMock";
import { IdGeneratorMock } from "./mocks/idGeneratorMock";
import { TokenGeneratorMock } from "./mocks/tokenGeneratorMock";
import { UserDatabaseMock } from "./mocks/userDatabaseMock";

const userBusinessMock = new UserBusiness(
  new UserDatabaseMock() as any,
  new IdGeneratorMock(),
  new TokenGeneratorMock(),
  new HashGeneratorMock()
);

describe("Teste de signUp", () => {
  test("Erro que deve retornar quando o nome está vazio", async () => {
    expect.assertions(2);
    try {
      await userBusinessMock.signup(
        "",
        "flavio@fravo.com",
        "flavio123",
        "ADMIN"
      );
    } catch (error) {
      //422, "Missing input"
      if (error instanceof CustomError) {
        expect(error.message).toEqual("Missing input");
        expect(error.statusCode).toEqual(422);
      } else {
        console.log(error);
      }
    }
  });
  test("Erro que deve retornar quando o email é inválido", async () => {
    expect.assertions;
    try {
      await userBusinessMock.signup(
        "Flaivo",
        "flaviofravo.com",
        "flavio123",
        "ADMIN"
      );
    } catch (error) {
      if (error instanceof CustomError) {
        expect(error.message).toEqual("Invalid email");
        expect(error.statusCode).toEqual(422);
      } else {
        console.log(error);
      }
    }
  });
  test("Erro que deve retornar quando a senha é inválida", async () => {
    expect.assertions;
    try {
      await userBusinessMock.signup(
        "Flaivo",
        "flavio@fravo.com",
        "12345",
        "ADMIN"
      );
    } catch (error) {
      if (error instanceof CustomError) {
        expect(error.message).toEqual("Invalid password");
        expect(error.statusCode).toEqual(422);
      } else {
        console.log(error);
      }
    }
  });
  test("Erro que deve retornar quando o tipo de usuário é inválido", async () => {
    expect.assertions;
    try {
      await userBusinessMock.signup(
        "Flaivo",
        "flavio@fravo.com",
        "123453",
        "adm"
      );
    } catch (error) {
      if (error instanceof CustomError) {
        expect(error.message).toEqual("Invalid user role");
        expect(error.statusCode).toEqual(422);
      } else {
        console.log(error);
      }
    }
  });
  test("Sucesso no cadastro e verificação do token de acesso", async () => {
    expect.assertions;
    try {
      const accessToken = await userBusinessMock.signup(
        "Flaivo",
        "flavio@fravo.com",
        "123453",
        "ADMIN"
      );
      expect(accessToken).toEqual({
        accessToken: "token_mockado",
      });
    } catch (error) {
      console.log(error);
    }
  });
});

/**
 * Teste 1: Erro que deve retornar quando o email fornecido não existe
 * Teste 2: Erro que deve retornar quando a senha está errada
 * Teste 3: Sucesso no login e verificação do token de acesso
 */

describe("Teste de login", () => {
  test("Erro que deve retornar quando o email fornecido não existe", async () => {
    expect.assertions;
    try {
      await userBusinessMock.login("fla@fravo.com", "flavio123");
    } catch (error) {
      if (error instanceof CustomError) {
        expect(error.message).toEqual("Invalid credentials");
        expect(error.statusCode).toEqual(401);
      } else {
        console.log(error);
      }
    }
  });
  test("Erro que deve retornar quando a senha está errada", async () => {
    expect.assertions;
    try {
      await userBusinessMock.login("flavio@fravo.com", "flavio321");
    } catch (error) {
      if (error instanceof CustomError) {
        expect(error.message).toEqual("Invalid credentials");
        expect(error.statusCode).toEqual(401);
      } else {
        console.log(error);
      }
    }
  });
  test("Sucesso no login e verificação do token de acesso", async () => {
    expect.assertions;
    try {
      const result = await userBusinessMock.login(
        "flavio@fravo.com",
        "flavio123"
      );
      expect(result).toEqual({ accessToken: "token_mockado" });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("Teste de getByID", () => {
  test("Erro de usuario nao econtrado", async () => {
    expect.assertions;
    try {
      await userBusinessMock.getUserById("id_mockado3");
    } catch (error) {
      if (error instanceof CustomError) {
        expect(error.message).toEqual("User not found");
        expect(error.statusCode).toEqual(404);
      } else {
        console.log(error);
      }
    }
  });
  test("Sucesso ao encontrar usuario", async () => {
    expect.assertions;
    try {
      const result = await userBusinessMock.getUserById("id_mockado");
      expect(result).toEqual({
        id: "id_mockado",
        name: "flavio",
        email: "flavio@lab.com",
        password: "flavio123",
        role: "nomral",
      });
    } catch (error) {
      console.log(error);
    }
  });
});



// Mock das dependências do UserBusiness
const userDatabaseMock = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
  getAllUsers: jest.fn()
};

const idGeneratorMock = {
  generate: jest.fn()
};

const hashGeneratorMock = {
  hash: jest.fn(),
  compareHash: jest.fn()
};

const tokenGeneratorMock = {
  generate: jest.fn(),
  verify: jest.fn()
};

describe("UserBusiness", () => {
  describe("getUsersAll", () => {
    test("Erro de não autorizado", async () => {
      const token = "invalid_token";
      const userBusiness = new UserBusiness(
        userDatabaseMock as any,
        idGeneratorMock as any,
        tokenGeneratorMock as any,
        hashGeneratorMock as any
      );

      tokenGeneratorMock.verify.mockReturnValue({ id: "userId", role: "user" });

      try {
        await userBusiness.getUsersAll(token);
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Unauthorized");
      }

      expect(userDatabaseMock.getAllUsers).not.toBeCalled();
    });

    test("Resposta de sucesso", async () => {
      const token = "valid_token";
      const userBusiness = new UserBusiness(
        userDatabaseMock as any,
        idGeneratorMock as any,
        tokenGeneratorMock as any,
        hashGeneratorMock as any
      );

      tokenGeneratorMock.verify.mockReturnValue({ id: "userId", role: "admin" });
      userDatabaseMock.getAllUsers.mockReturnValue(["user1", "user2", "user3"]);

      const result = await userBusiness.getUsersAll(token);

      expect(result).toEqual({ users: ["user1", "user2", "user3"] });
      expect(userDatabaseMock.getAllUsers).toBeCalled();
    });
  });
});

const userDatabaseProfileMock = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
  getProfile: jest.fn()
};
describe("UserBusiness", () => {
  describe("getProfile", () => {
    test("Erro de token ausente", async () => {
      const token = "";
      const userBusiness = new UserBusiness(
        userDatabaseMock as any,
        idGeneratorMock as any,
        tokenGeneratorMock as any,
        hashGeneratorMock as any
      );

      try {
        await userBusiness.getProfile(token);
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.statusCode).toBe(422);
        expect(error.message).toBe("Missing input");
      }

      expect(userDatabaseProfileMock.getProfile).not.toBeCalled();
    });

    test("Obter perfil com sucesso", async () => {
      const token = "valid_token";
      const userId = "userId";
      const profileData = { name: "John Doe", email: "john@example.com", role: "user" };

      const userBusiness = new UserBusiness(
        userDatabaseProfileMock as any,
        idGeneratorMock as any,
        tokenGeneratorMock as any,
        hashGeneratorMock as any
      );

      tokenGeneratorMock.verify.mockReturnValue({ id: userId });
      userDatabaseProfileMock.getProfile.mockReturnValue(profileData);

      const result = await userBusiness.getProfile(token);

      expect(result).toEqual({ profile: profileData });
      expect(userDatabaseProfileMock.getProfile).toBeCalledWith(userId);
    });
  });
});