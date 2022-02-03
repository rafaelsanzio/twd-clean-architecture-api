import { User } from '@/entities'
import { Either } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { UseCase } from '@/usecases/ports'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports'

export class SendEmail implements UseCase {
  private readonly emailOptions: EmailOptions
  private readonly emailService: EmailService

  constructor(emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions
    this.emailService = emailService
  }

  async perform(user: User): Promise<Either<MailServiceError, EmailOptions>> {
    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: `${user.name.value} <${user.email.value}>`
    }

    return await this.emailService.send(emailInfo)
  }
}
