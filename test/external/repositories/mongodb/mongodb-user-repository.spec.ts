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
    MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()

    const user = {
      name: 'Any Name',
      email: 'any@mail.com'
    }
    await userRepository.add(user)
    const userExist = await userRepository.exists(user.email)

    expect(userExist).toBeTruthy()
  })
})
