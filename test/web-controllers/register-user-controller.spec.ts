import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterAndSendEmailController } from '@/web-controllers/register-user-controller'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'
import { MailServiceError } from '@/usecases/errors'
import { Either, right } from '@/shared'
import { SendEmail } from '@/usecases/send-email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'From Name'
const fromEmail = 'from_email@mail.com'
const toName = 'To Name'
const toEmail = 'to_email@mail.com'
const subject = 'Test e-mail'
const emailBody = 'Hello world attachment test'
const emailBodyHTML = '<b>Hello world attachment test</b>'
const attachmment = [
  {
    filename: attachmentFilePath,
    contentType: 'text/plain'
  }
]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: `${fromName} <${fromEmail}>`,
  to: `${toName} <${toEmail}>`,
  subject,
  text: emailBody,
  html: emailBodyHTML,
  attachments: attachmment
}

class MailServiceStub implements EmailService {
  async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

describe('Register user web controller', () => {
  const users: UserData[] = []

  const repo: UserRepository = new InMemoryUserRepository(users)
  const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

  const mailServiceStub = new MailServiceStub()

  const sendEmailUsecase: SendEmail = new SendEmail(mailOptions, mailServiceStub)
  const registerAndSendEmailUsecase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUsecase, sendEmailUsecase)

  const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUsecase)
  class ErrorThrowingUseCaseStub implements UseCase {
    perform(request: any): Promise<void> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

  test('should return status code ok when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com'
      }
    }

    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(200)
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

    const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
