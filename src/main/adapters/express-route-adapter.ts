import { Request, Response } from 'express'

import { RegisterUserController } from '@/web-controllers'
import { HttpRequest } from '@/web-controllers/ports'

export const adaptRoute = (controller: RegisterUserController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const httpResponse = await controller.handle(httpRequest)

    response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
