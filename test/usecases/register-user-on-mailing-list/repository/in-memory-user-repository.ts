import { UserData } from '../../../../src/entities/user-data'
import { UserRepository } from '../../../../src/usecases/register-user-on-mailing-list/ports/user-repository'

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
    return user || null
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
