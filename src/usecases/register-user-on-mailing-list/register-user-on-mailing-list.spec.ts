import { UserData } from '../../entities/user-data'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    console.log(users)

    /* const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingListUseCase(repo)

    const name = 'any_name'
    const email = 'any@email.com'

    const response = await useCase.registerUserOnMailingList({ name, email })
    const user = repo.findUserByEmail(email)

    expect((await user).name).toBe(name) */
  })
})
