import { Express } from 'express'
import { bodyParser } from '@/main/config/middlewares/body-parser'

export default (app: Express): void => {
  app.use(bodyParser)
}
