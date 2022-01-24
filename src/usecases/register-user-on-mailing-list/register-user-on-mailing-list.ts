import { InvalidEmailError, InvalidNameError } from '../../entities/errors'
import { User, UserData } from '../../entities'
import { Either, left, right } from '../../shared'
import { UserRepository } from './ports'

export class RegisterUserOnMailingList {
  private readonly userRepo: UserRepository

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async registerUserOnMailingList(
    request: UserData
  ): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const userExists = await this.userRepo.exists(request.email)
    if (!userExists) {
      await this.userRepo.add(request)
    }

    return right(request)
  }
}
