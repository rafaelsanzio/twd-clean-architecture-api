import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterUserController } from '@/web-controllers/register-user-controller'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const usecase: UseCase = new RegisterUserOnMailingList(repo)
  const controller: RegisterUserController = new RegisterUserController(usecase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform(request: any): Promise<void> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }

    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })

  test('should return status code 400 when request contains invalid or missing values', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@mail.com'
      }
    }

    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'invalidmail.com'
      }
    }

    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'any@mail.com'
      }
    }

    const requestWithMissingEmail: HttpRequest = {
      body: {
        name: 'Any name'
      }
    }

    const requestWithMissingAllParams: HttpRequest = {
      body: {}
    }

    const testCases = [
      {
        request: requestWithInvalidName,
        error: InvalidNameError,
        message: `Invalid Name: ${requestWithInvalidName.body.name}`
      },
      {
        request: requestWithInvalidEmail,
        error: InvalidEmailError,
        message: `Invalid Email: ${requestWithInvalidEmail.body.email}`
      },
      { request: requestWithMissingName, error: MissingParamError, message: 'Missing parameter from request: name' },
      { request: requestWithMissingEmail, error: MissingParamError, message: 'Missing parameter from request: email' },
      {
        request: requestWithMissingAllParams,
        error: MissingParamError,
        message: 'Missing parameter from request: name email'
      }
    ]

    for (const { request, error, message } of testCases) {
      const response: HttpResponse = await controller.handle(request)

      expect(response.statusCode).toEqual(400)
      expect(response.body).toBeInstanceOf(error)
      expect((response.body as Error).message).toEqual(message)
    }
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }

    const controller: RegisterUserController = new RegisterUserController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
