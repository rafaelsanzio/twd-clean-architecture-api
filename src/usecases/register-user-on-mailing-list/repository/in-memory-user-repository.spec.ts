import { UserRepository } from '../ports/user-repository'
import { UserData } from '../user-data'
import { InMemoryUserRepository } from './in-memory-user-repository'

describe('In menory User repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepo: UserRepository = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user).toBeUndefined()
  })
})
