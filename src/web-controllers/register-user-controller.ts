import { UserData } from '@/entities'
import { UseCase } from '@/usecases/ports'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, ok, serverError } from '@/web-controllers/util'
import { MissingParamError } from './errors'

export class RegisterAndSendEmailController {
  private readonly usecase: UseCase

  constructor(usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.body.name || !request.body.email) {
        let missingParam = !request.body.name ? 'name ' : ''
        missingParam += !request.body.email ? 'email' : ''

        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const user: UserData = request.body
      const response = await this.usecase.perform(user)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return ok(response.value)
    } catch (err) {
      return serverError(err)
    }
  }
}
