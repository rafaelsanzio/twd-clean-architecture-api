import { UserRepository } from '../ports/user-repository'
import { UserData } from '../user-data'

export class InMemoryUserRepository implements UserRepository {
  private repository: UserData[] = []

  constructor(users: UserData[]) {
    this.repository = users
  }

  async add(user: UserData): Promise<void> {
    const exists = await this.exists(user.email)
    if (!exists) {
      this.repository.push(user)
    }
  }

  async findUserByEmail(email: string): Promise<UserData> {
    const user = this.repository.find((user) => user.email === email)
    if (!user) {
      return null
    }

    return user
  }

  async findAllUsers(): Promise<UserData[]> {
    return this.repository
  }

  async exists(email: string): Promise<boolean> {
    if ((await this.findUserByEmail(email)) === null) {
      return false
    }
    return true
  }
}
