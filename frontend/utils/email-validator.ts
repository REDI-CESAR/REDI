export class EmailValidator {
  /**
   * Validates if the provided email address has a valid format.
   * @param {string} email - The email address to validate.
   * @returns {boolean} - Returns true if the email is valid, otherwise false.
   */
  static isValid(email: string) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    } catch (error) {
      console.log('erro validacao regex')
    }
  }
}
