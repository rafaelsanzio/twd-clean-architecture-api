import { left } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { User } from './user'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', async () => {
    const invalidEmail = 'invalid_email'
    const error = User.create({ name: 'any_name', email: invalidEmail })

    expect(error).toEqual(left(new InvalidEmailError()))
  })

  test('should not create user with invalid names', async () => {
    const invalidNames = ['O      ', 'O'.repeat(257)]

    for (const invalidName of invalidNames) {
      const error = User.create({ name: invalidName, email: 'any@mail.com' })

      expect(error).toEqual(left(new InvalidNameError()))
    }
  })
})
