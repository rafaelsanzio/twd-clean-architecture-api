import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const name = 'any_name'
    const email = 'any@email.com'

    const response = await useCase.registerUserOnMailingList({ name, email })
    const user = await repo.findUserByEmail(email)

    expect(user.name).toBe(name)
    expect(response.value.name).toBe(name)
  })

  test('should not add user with invalid email or invalid name to mailing list', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const testCases = [
      { name: 'any_name', email: 'invalid_email', error: 'InvalidEmailError' },
      { name: '', email: 'any@mail.com', error: 'InvalidNameError' }
    ]

    for (const testCase of testCases) {
      const response = (await useCase.registerUserOnMailingList({ name: testCase.name, email: testCase.email }))
        .value as Error
      const user = await repo.findUserByEmail(testCase.email)

      expect(user).toBeNull()
      expect(response.name).toEqual(testCase.error)
    }
  })
})
