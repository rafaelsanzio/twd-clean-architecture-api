import { User, UserData } from '@/entities'
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
  attachmments: attachmment
}

class MailServiceMock implements EmailService {
  public timeSendWasCalled = 0
  async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    this.timeSendWasCalled++
    return right(emailOptions)
  }
}

describe('Register and send email to user', () => {
  test('should add user with complete data to mailing list', async () => {
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

    const response = (await registerAndSendEmailUsecase.perform({ name, email })).value as User
    const user = await repo.findUserByEmail(email)

    expect(user.name).toBe(name)
    expect(response.name.value).toBe(name)
    expect(mailServiceMock.timeSendWasCalled).toBe(1)
  })
})
