import { User } from '../../src/entities'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', async () => {
    const invalidEmail = 'invalid_email'
    const error = User.create({ name: 'any_name', email: invalidEmail }).value as Error

    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual(`Invalid Email: ${invalidEmail}.`)
  })

  test('should not create user with invalid names', async () => {
    const invalidNames = ['O      ', 'O'.repeat(257)]

    for (const invalidName of invalidNames) {
      const error = User.create({ name: invalidName, email: 'any@mail.com' }).value as Error

      expect(error.name).toEqual('InvalidNameError')
      expect(error.message).toEqual(`Invalid Name: ${invalidName}.`)
    }
  })

  test('should create user with valid data', async () => {
    const validName = 'any_name'
    const validEmail = 'any@mail.com'

    const user: User = User.create({ name: validName, email: validEmail }).value as User

    expect(user.name.value).toEqual(validName)
    expect(user.email.value).toEqual(validEmail)
  })
})
