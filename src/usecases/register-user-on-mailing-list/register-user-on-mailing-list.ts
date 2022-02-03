import { User, UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { UseCase } from '@/usecases/ports/'

export class RegisterUserOnMailingList implements UseCase {
  private readonly userRepo: UserRepository

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async perform(request: User): Promise<UserData> {
    const userData = { name: request.name.value, email: request.email.value }

    const userExists = await this.userRepo.exists(request.email.value)
    if (!userExists) {
      await this.userRepo.add(userData)
    }

    return userData
  }
}
