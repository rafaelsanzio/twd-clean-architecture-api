import { UserRepository } from '../ports/user-repository'
import { UserData } from '../user-data'

export class InMemoryUserRepository implements UserRepository {
  private users: UserData[] = []

  constructor(users: UserData[]) {
    this.users = users
  }

  async add(user: UserData): Promise<void> {
    this.users.push(user)
  }

  async findUserByEmail(email: string): Promise<UserData> {
    return this.users.find((user) => user.email === email)
  }

  async findAllUsers(): Promise<UserData[]> {
    return this.users
  }

  async exists(email: string): Promise<boolean> {
    return this.users.some((user) => user.email === email)
  }
}
