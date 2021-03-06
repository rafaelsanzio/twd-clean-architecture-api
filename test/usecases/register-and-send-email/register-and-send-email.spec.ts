import { UserData } from '@/entities'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-email'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

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

class MailServiceMock implements EmailService {
  public timeSendWasCalled = 0
  async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    this.timeSendWasCalled++
    return right(emailOptions)
  }
}

describe('Register and send email to user', () => {
  test('should register user and send an email with valid data', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const mailServiceMock = new MailServiceMock()
    const sendEmailUsecase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

    const registerAndSendEmailUsecase: RegisterAndSendEmail = new RegisterAndSendEmail(
      registerUsecase,
      sendEmailUsecase
    )
    const name = 'any_name'
    const email = 'any@email.com'

    const response: UserData = (await registerAndSendEmailUsecase.perform({ name, email })).value as UserData
    const user = await repo.findUserByEmail(email)

    expect(user.name).toBe(name)
    expect(response.name).toBe(name)
    expect(mailServiceMock.timeSendWasCalled).toBe(1)
  })

  test('should not register user and send an email with invalid data', async () => {
    const users: UserData[] = []

    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)

    const mailServiceMock = new MailServiceMock()
    const sendEmailUsecase: SendEmail = new SendEmail(mailOptions, mailServiceMock)

    const registerAndSendEmailUsecase: RegisterAndSendEmail = new RegisterAndSendEmail(
      registerUsecase,
      sendEmailUsecase
    )

    const testCases = [
      { name: 'any_name', email: 'invalid_email', error: 'InvalidEmailError' },
      { name: '', email: 'any@mail.com', error: 'InvalidNameError' }
    ]

    for (const testCase of testCases) {
      const response = (await registerAndSendEmailUsecase.perform({ name: testCase.name, email: testCase.email }))
        .value as Error

      expect(response.name).toEqual(testCase.error)
    }
  })
})
