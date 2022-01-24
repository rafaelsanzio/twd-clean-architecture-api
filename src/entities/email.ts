import { Either, left, right } from '../shared'
import { InvalidEmailError } from './errors'

export class Email {
  public readonly value: string

  private constructor(email: string) {
    this.value = email
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    if (!Email.validate(email)) {
      return left(new InvalidEmailError(email))
    }

    return right(new Email(email))
  }

  static validate(email: string): boolean {
    const emailRegex =
      /^[-!#$%&'*+/0-9=?A-Zˆ_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Zˆ_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!email) {
      return false
    }

    if (email.length > 320) {
      return false
    }

    if (!emailRegex.test(email)) {
      return false
    }

    const [local, domain] = email.split('@')
    if (local.length > 64 || local.length === 0 || domain.length > 255 || domain.length === 0) {
      return false
    }

    const domainParts = domain.split('.')
    if (domainParts.some((part) => part.length > 63)) {
      return false
    }

    return true
  }
}
