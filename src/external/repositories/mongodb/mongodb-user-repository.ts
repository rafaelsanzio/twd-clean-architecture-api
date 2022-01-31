import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MongoHelper } from './helper'

export class MongodbUserRepository implements UserRepository {
  async add(user: UserData): Promise<void> {
    const userCollection = MongoHelper.getCollection('users')
    const userExist = await this.exists(user.email)
    if (!userExist) {
      await userCollection.insertOne(user)
    }
  }

  findUserByEmail(email: string): Promise<UserData> {
    const userCollection = MongoHelper.getCollection('users')
    const user = userCollection.findOne({ email })
    return user || null
  }

  async findAllUsers(): Promise<UserData[]> {
    const userCollection = MongoHelper.getCollection('users')
    return await userCollection.find().toArray()
  }

  async exists(email: string): Promise<boolean> {
    const foundUser = await this.findUserByEmail(email)
    if (foundUser === null) {
      return false
    }
    return true
  }
}
