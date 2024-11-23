export type PasswordValidations = {
  isValid: boolean
  messages: string[]
}

export class PasswordValidator {
  /**
   * Validates if the provided password has a valid format.
   * @param {string} password - The password to validate.
   * @returns {boolean} - Returns true if the password is valid, otherwise false.
   */
  static isValid(password: string): PasswordValidations {
    try {
      const result: PasswordValidations = {
        isValid: true,
        messages: []
      }

      if (password.length < 6) {
        result.isValid = false
        result.messages.push('Senha deve conter 6 caracteres')
      }

      // if (!/[A-Z]/g.test(password)) {
      //   result.isValid = false
      //   result.messages.push('Senha deve conter 1 letra maiscula')
      // }

      // if (!/[a-z]/g.test(password)) {
      //   result.isValid = false
      //   result.messages.push('Senha deve conter 1 letra minuscula')
      // }

      return result
    } catch (error) {
      return {
        isValid: false,
        messages: ['Não foi possível validar a senha']
      }
    }
  }
}
