import { UserData } from '../../../../src/entities/user-data'
import { UserRepository } from '../../../../src/usecases/register-user-on-mailing-list/ports/user-repository'
import { InMemoryUserRepository } from './in-memory-user-repository'

describe('In menory User repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const sut: UserRepository = new InMemoryUserRepository(users)
    const user = await sut.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if it is found in the repository', async () => {
    const users: UserData[] = []

    const name = 'any_name'
    const email = 'any@email.com'

    const sut = new InMemoryUserRepository(users)
    await sut.add({ name, email })

    const user = await sut.findUserByEmail(email)

    expect(user.name).toBe(name)
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [
      { name: 'any_name', email: 'any@email.com' },
      { name: 'any_name2', email: 'any2@email.com' }
    ]

    const sut = new InMemoryUserRepository(users)

    const returnedUsers = await sut.findAllUsers()

    expect(returnedUsers.length).toBe(2)
  })
})
