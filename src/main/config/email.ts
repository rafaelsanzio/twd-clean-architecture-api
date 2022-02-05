import { EmailOptions } from '@/usecases/send-email/ports'

const attachments = [
  {
    filename: 'text.txt',
    path: '../../resources/text.txt'
  }
]

export function getEmailOptions(): EmailOptions {
  const from = 'Rafael Sanzio | Rafael Sanzio <rafaelsanzio27@gmail.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from,
    to,
    subject: 'Test Message',
    text: 'Test Message',
    html: '<b>Test Message</b>',
    attachments
  }

  return mailOptions
}
