import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { MongoHelper } from '@/external/repositories/mongodb/helper'

describe('MongoDB User repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()

    await userRepository.add({
      name: 'Any Name',
      email: 'any@mail.com'
    })
    const userExist = await userRepository.exists('any@mail.com')

    expect(userExist).toBeTruthy()
  })

  test('find all users should return all added users', async () => {
    const userRepository = new MongodbUserRepository()

    await userRepository.add({
      name: 'First Name',
      email: 'first@mail.com'
    })

    await userRepository.add({
      name: 'Second Name',
      email: 'second@mail.com'
    })

    const users = await userRepository.findAllUsers()

    expect(users.length).toBe(2)
    expect(users[0].name).toBe('First Name')
    expect(users[1].name).toBe('Second Name')
  })
})
