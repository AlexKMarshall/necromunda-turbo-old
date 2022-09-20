import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import morgan from 'koa-morgan'
import { router } from './router'

export const createServer = () => {
  const app = new Koa()
  app
    .use(morgan('dev'))
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())

  return app
}
