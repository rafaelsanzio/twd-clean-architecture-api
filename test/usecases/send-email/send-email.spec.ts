import { Either, Left, Right, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
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

class MailServiceStub implements EmailService {
  async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

describe('Send email to user', () => {
  test('should email user cases', async () => {
    const testCases = [
      { name: toName, email: toEmail, expected: Right },
      { name: toName, email: 'invalid_mail', expected: Left }
    ]

    const mailServiceStub = new MailServiceStub()
    const usecase = new SendEmail(mailOptions, mailServiceStub)

    for (const { name, email, expected } of testCases) {
      const response = await usecase.perform({ name, email })
      expect(response).toBeInstanceOf(expected)
    }
  })
})
