import { UserData } from '@/entities'
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

  async perform(userData: UserData): Promise<Either<MailServiceError, EmailOptions>> {
    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: `${userData.name} <${userData.email}>`
    }

    return await this.emailService.send(emailInfo)
  }
}
