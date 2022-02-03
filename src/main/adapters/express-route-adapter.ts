import { Request, Response } from 'express'

import { RegisterAndSendEmailController } from '@/web-controllers'
import { HttpRequest } from '@/web-controllers/ports'

export const adaptRoute = (controller: RegisterAndSendEmailController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const httpResponse = await controller.handle(httpRequest)

    response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
