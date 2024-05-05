import { CustomError } from "../errors/CustomError";
import { CharacterDataBase } from "../data/CharacterDatabase";
import { CharacterModel, validateCharacter } from "../model/CharacterModel";
// exercicio 3
export class CharacterBusiness {

  constructor(private characterDatabase: CharacterDataBase){}

  public async performAttackeDP(
    attacker: CharacterModel,
    defender: CharacterModel
  ) {
    try {
      if(!attacker || !defender) {
        throw new CustomError(422, "Missing input!");
      }

      if(!this.characterDatabase.validateCharacter(attacker) || !this.characterDatabase.validateCharacter(defender)) {
        throw new CustomError(422, "Character Invalid")
      }

      if(defender.getDefesa() > attacker.getForca()) {
        return 'Defesa maior, nenhuma vida tirada!'
      }
      let vidaAtual = defender.getVida()
      let novaVida = vidaAtual - attacker.getForca()
      defender.setVida(novaVida)

      return { defender }
      

    } catch (error) {
      if (error instanceof CustomError) {
         if (error.message.includes("key 'email'")) {
            throw new CustomError(409, "Email already in use")
         }

         throw new CustomError(error.statusCode, error.message)
      }
   }
  }

  public async performAttacke(
    attacker: CharacterModel,
    defender: CharacterModel,
    validateCharacter: (input: any) => boolean
  ) {
    try {
      if(!attacker || !defender) {
        throw new CustomError(422, "Missing input!");
      }

      if(!validateCharacter(attacker) || !validateCharacter(defender)) {
        throw new CustomError(422, "Character Invalid")
      }

      if(defender.getDefesa() > attacker.getForca()) {
        return 'Defesa maior, nenhuma vida tirada!'
      }
      let vidaAtual = defender.getVida()
      let novaVida = vidaAtual - attacker.getForca()
      defender.setVida(novaVida)

      return defender.getVida()
      

    } catch (error) {
      if (error instanceof CustomError) {
         if (error.message.includes("key 'email'")) {
            throw new CustomError(409, "Email already in use")
         }

         throw new CustomError(error.statusCode, error.message)
      }
   }
  }
  
}